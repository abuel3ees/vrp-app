<?php

namespace App\Services\VRP;

use App\Models\Delivery;
use App\Models\VehicleRoute;
use App\Models\Instance;
use Illuminate\Support\Facades\Log;

class VRPSolverService
{
    private const MAX_CLUSTER_SIZE = 300;
    private const VIRTUAL_EDGE_COST = 999999;

    public function solve(Instance $instance, string $profile = 'brazil'): array
    {
        // ---------------------------------------------------------
        // 1. LOAD CONFIGURATION & DEFINE PROJECTION
        // ---------------------------------------------------------
        $roads     = JsonLoader::loadRoadFiles($profile);
        $settings  = JsonLoader::loadSettings($profile);
        $penalties = JsonLoader::loadPenalties($profile);
        $roadTypes = JsonLoader::loadRoadTypes($profile);

        // Define Projection Constants for PathBuilder
        // These align the mathematical graph with the Mapbox display
        if ($profile === 'amman') {
            $BASE_LAT = 31.9539;
            $BASE_LNG = 35.9106;
            $SCALE    = 0.00005; 
        } else {
            // Brazil Defaults
            $BASE_LAT = -15.78;
            $BASE_LNG = -47.93;
            $SCALE    = 0.00005;
        }

        // ---------------------------------------------------------
        // 2. BUILD GRAPH
        // ---------------------------------------------------------
        $graphBuilder = new GraphBuilder(
            $settings['PIXEL_VALUE'] ?? 1.0,
            $roadTypes,
            $penalties
        );
        
        $graph = $graphBuilder->build($roads);

        // Add "Virtual Edges" to allow flying between disconnected road islands
        // This prevents the solver from crashing if a node is unreachable
        $graph['edges'] = GraphConnectivityService::buildVirtualEdges(
            $graph['edges'],
            $graph['nodes'],
            self::VIRTUAL_EDGE_COST
        );

        // ---------------------------------------------------------
        // 3. FETCH & SNAP DELIVERIES
        // ---------------------------------------------------------
        $deliveries = Delivery::where('instance_id', $instance->id)
            ->get(['id', 'x', 'y'])
            ->toArray();

        if (count($deliveries) === 0) {
            throw new \Exception("No deliveries found for instance #{$instance->id}");
        }

        $deliveryNodeMap = DeliverySnapService::snapDeliveries(
            $deliveries,
            $graph['nodes']
        );

        // Validate all deliveries were snapped successfully
        $unsnappedDeliveries = [];
        foreach ($deliveries as $d) {
            if (!isset($deliveryNodeMap[$d['id']])) {
                $unsnappedDeliveries[] = $d['id'];
            }
        }
        
        if (!empty($unsnappedDeliveries)) {
            Log::warning("Failed to snap " . count($unsnappedDeliveries) . " deliveries: " . implode(', ', array_slice($unsnappedDeliveries, 0, 10)));
        }

        // ---------------------------------------------------------
        // 4. SMART DEPOT LOCATION
        // ---------------------------------------------------------
        $depotX = $settings['DEPOT_X'] ?? 0;
        $depotY = $settings['DEPOT_Y'] ?? 0;

        if ($depotX == 0 && $depotY == 0) {
            // Calculate centroid of all deliveries
            $sumX = 0; 
            $sumY = 0;
            foreach ($deliveries as $d) {
                $sumX += $d['x'];
                $sumY += $d['y'];
            }
            $centroidX = $sumX / count($deliveries);
            $centroidY = $sumY / count($deliveries);
            
            // Find the nearest actual road node to the centroid
            $nearestNode = $this->findNearestNode($centroidX, $centroidY, $graph['nodes']);
            if ($nearestNode) {
                $depotX = $nearestNode['x'];
                $depotY = $nearestNode['y'];
                Log::info("Calculated depot from centroid, snapped to nearest road node: $depotX, $depotY");
            } else {
                $depotX = $centroidX;
                $depotY = $centroidY;
                Log::warning("Could not find nearby road node for depot centroid: $centroidX, $centroidY");
            }
        }

        $depotSnap = DeliverySnapService::snapDeliveries(
            [['id' => 'depot', 'x' => $depotX, 'y' => $depotY]],
            $graph['nodes']
        );
        
        if (!isset($depotSnap['depot'])) {
            throw new \Exception("Failed to snap depot to road network at ($depotX, $depotY)");
        }
        
        $depotNodeId = $depotSnap['depot'];

        // ---------------------------------------------------------
        // 5. CLUSTERING & ALLOCATION
        // ---------------------------------------------------------
        $settings['DEPOT_X'] = $depotX;
        $settings['DEPOT_Y'] = $depotY;

        $clusters = $this->buildClustersByAngle(
            $deliveries,
            $settings,
            $instance->number_of_vehicles
        );

        $clusterVehicles = $this->allocateVehiclesForClusters(
            $clusters,
            $instance->number_of_vehicles
        );

        Log::info("Created " . count($clusters) . " clusters for " . count($deliveries) . " deliveries with " . $instance->number_of_vehicles . " vehicles");

        // ---------------------------------------------------------
        // 6. SOLVER LOOP
        // ---------------------------------------------------------
        $allVehicles   = [];
        $vehicleNumber = 1;
        $totalDeliveriesProcessed = 0;

        foreach ($clusters as $clusterIndex => $clusterDeliveries) {
            if (empty($clusterDeliveries)) {
                Log::warning("Cluster $clusterIndex is empty, skipping");
                continue;
            }

            $vehiclesForCluster = $clusterVehicles[$clusterIndex] ?? 1;
            if ($vehiclesForCluster <= 0) {
                Log::warning("Cluster $clusterIndex has 0 vehicles allocated, assigning 1");
                $vehiclesForCluster = 1;
            }

            // Get Graph Node IDs for this cluster
            $clusterNodeIds = [];
            $clusterDeliveryIds = [];
            foreach ($clusterDeliveries as $d) {
                if (isset($deliveryNodeMap[$d['id']])) {
                    $clusterNodeIds[] = $deliveryNodeMap[$d['id']];
                    $clusterDeliveryIds[] = $d['id'];
                } else {
                    Log::warning("Delivery {$d['id']} in cluster $clusterIndex has no mapped node");
                }
            }

            if (empty($clusterNodeIds)) {
                Log::error("Cluster $clusterIndex has no valid node mappings for " . count($clusterDeliveries) . " deliveries");
                continue;
            }

            $totalDeliveriesProcessed += count($clusterNodeIds);

            // 6a. Build Distance Matrix (Depot + Customers)
            $pointsForMatrix = array_merge([$depotNodeId], $clusterNodeIds);

            $matrixData = DistanceMatrixService::build(
                $graph['edges'],
                $pointsForMatrix
            );

            // 6b. Build VRP Model
            $maxRoute = $instance->max_allowed_route ?? 9999999;
            $vrpModel = VRPModelBuilder::build(
                $matrixData,
                $vehiclesForCluster,
                $maxRoute
            );

            // 6c. Run Clarke-Wright Algorithm
            $routes = ClarkeWrightService::solve($vrpModel);

            // 6d. Validate routes respect constraints
            $routes = $this->validateAndFixRoutes($routes, $matrixData, $maxRoute);

            // 6e. Build Detailed Paths (Geometry)
            $vehicles = PathBuilderService::buildPaths(
                $routes,
                $matrixData['points'],
                $graph['nodes'],
                $graph['edges'],
                $settings['PIXEL_VALUE'] ?? 1.0,
                $BASE_LAT,
                $BASE_LNG,
                $SCALE
            );

            // 6f. Check for virtual edges in routes (potential issues)
            foreach ($vehicles as &$vehicle) {
                $vehicle['vehicle_id'] = $vehicleNumber++;
                $vehicle['has_virtual_edges'] = $this->checkForVirtualEdges($vehicle, $graph['edges']);
                
                if ($vehicle['has_virtual_edges']) {
                    Log::warning("Vehicle {$vehicle['vehicle_id']} route contains virtual edges (disconnected road segments)");
                }
                
                $allVehicles[] = $vehicle;
            }
            unset($vehicle); // Break reference
        }

        // Validate we processed all deliveries
        $expectedDeliveries = count($deliveries) - count($unsnappedDeliveries);
        if ($totalDeliveriesProcessed < $expectedDeliveries) {
            Log::error("Only processed $totalDeliveriesProcessed of $expectedDeliveries expected deliveries");
        }

        // ---------------------------------------------------------
        // 7. SAVE RESULTS
        // ---------------------------------------------------------
        VehicleRoute::where('instance_id', $instance->id)->delete();

        foreach ($allVehicles as $v) {
            VehicleRoute::create([
                'instance_id'    => $instance->id,
                'vehicle_number' => $v['vehicle_id'],
                'deliveries'     => $v['sequence'],
                'steps'          => $v['steps'],
                'full_path'      => $v['full_path'],
                'cost'           => $v['cost'],
            ]);
        }

        Log::info("VRP Solver completed: " . count($allVehicles) . " vehicle routes created for instance #{$instance->id}");

        return $allVehicles;
    }

    // -------------------------------------------------------------
    // HELPERS
    // -------------------------------------------------------------

    /**
     * Find the nearest graph node to a given point
     */
    private function findNearestNode(float $x, float $y, array $nodes): ?array
    {
        $nearest = null;
        $minDist = PHP_FLOAT_MAX;

        foreach ($nodes as $node) {
            $dist = sqrt(pow($node['x'] - $x, 2) + pow($node['y'] - $y, 2));
            if ($dist < $minDist) {
                $minDist = $dist;
                $nearest = $node;
            }
        }

        return $nearest;
    }

    /**
     * Check if a vehicle route uses any virtual (flying) edges
     */
    private function checkForVirtualEdges(array $vehicle, array $edges): bool
    {
        $steps = $vehicle['steps'] ?? [];
        
        for ($i = 0; $i < count($steps) - 1; $i++) {
            $from = $steps[$i];
            $to = $steps[$i + 1];
            
            // Check if this edge exists with virtual cost
            $edgeKey = "{$from['x']},{$from['y']}-{$to['x']},{$to['y']}";
            $reverseKey = "{$to['x']},{$to['y']}-{$from['x']},{$from['y']}";
            
            $edgeCost = $edges[$edgeKey] ?? $edges[$reverseKey] ?? null;
            
            if ($edgeCost !== null && $edgeCost >= self::VIRTUAL_EDGE_COST) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validate routes respect max_allowed_route and fix if possible
     */
    private function validateAndFixRoutes(array $routes, array $matrixData, float $maxRoute): array
    {
        $validatedRoutes = [];

        foreach ($routes as $route) {
            $routeCost = $this->calculateRouteCost($route, $matrixData);
            
            if ($routeCost > $maxRoute) {
                Log::warning("Route exceeds max_allowed_route ($routeCost > $maxRoute), attempting to split");
                // Split the route into smaller feasible routes
                $splitRoutes = $this->splitOversizedRoute($route, $matrixData, $maxRoute);
                $validatedRoutes = array_merge($validatedRoutes, $splitRoutes);
            } else {
                $validatedRoutes[] = $route;
            }
        }

        return $validatedRoutes;
    }

    /**
     * Calculate total cost of a route
     */
    private function calculateRouteCost(array $route, array $matrixData): float
    {
        $cost = 0;
        $matrix = $matrixData['matrix'] ?? [];
        $sequence = $route['sequence'] ?? [];

        if (count($sequence) < 2) {
            return 0;
        }

        // Cost from depot to first, between all stops, and back to depot
        for ($i = 0; $i < count($sequence) - 1; $i++) {
            $from = $sequence[$i];
            $to = $sequence[$i + 1];
            $cost += $matrix[$from][$to] ?? 0;
        }

        return $cost;
    }

    /**
     * Split an oversized route into multiple feasible routes
     */
    private function splitOversizedRoute(array $route, array $matrixData, float $maxRoute): array
    {
        $sequence = $route['sequence'] ?? [];
        $matrix = $matrixData['matrix'] ?? [];
        
        // Remove depot (index 0) from sequence for splitting
        $customers = array_filter($sequence, fn($idx) => $idx !== 0);
        $customers = array_values($customers);

        if (empty($customers)) {
            return [$route];
        }

        $splitRoutes = [];
        $currentRoute = [0]; // Start with depot
        $currentCost = 0;

        foreach ($customers as $customer) {
            $lastStop = end($currentRoute);
            $addCost = ($matrix[$lastStop][$customer] ?? 0) + ($matrix[$customer][0] ?? 0);
            $removeCost = $matrix[$lastStop][0] ?? 0;
            $netAddition = $addCost - $removeCost;

            if ($currentCost + $netAddition <= $maxRoute || count($currentRoute) === 1) {
                $currentRoute[] = $customer;
                $currentCost = $currentCost - $removeCost + $addCost;
            } else {
                // Close current route and start new one
                $currentRoute[] = 0; // Return to depot
                $splitRoutes[] = ['sequence' => $currentRoute, 'cost' => $currentCost];
                
                // Start new route
                $currentRoute = [0, $customer];
                $currentCost = ($matrix[0][$customer] ?? 0) + ($matrix[$customer][0] ?? 0);
            }
        }

        // Close final route
        if (count($currentRoute) > 1) {
            $currentRoute[] = 0;
            $splitRoutes[] = ['sequence' => $currentRoute, 'cost' => $currentCost];
        }

        Log::info("Split oversized route into " . count($splitRoutes) . " routes");

        return $splitRoutes;
    }

    /**
     * Build clusters using angle-based partitioning with wrap-around handling
     */
    private function buildClustersByAngle(
        array $deliveries,
        array $settings,
        int $vehicleCount
    ): array {
        $total = count($deliveries);
        if ($total === 0) return [];

        if ($total <= self::MAX_CLUSTER_SIZE && $vehicleCount <= 1) {
            return [$deliveries];
        }

        $dx0 = $settings['DEPOT_X'];
        $dy0 = $settings['DEPOT_Y'];

        $withAngle = [];
        foreach ($deliveries as $d) {
            $dx = $d['x'] - $dx0;
            $dy = $d['y'] - $dy0;
            // Calculate polar angle relative to depot (range: -π to π)
            $angle = atan2($dy, $dx);
            $withAngle[] = $d + ['_angle' => $angle];
        }

        // Sort by angle to group geographically close neighbors
        usort($withAngle, fn($a, $b) => $a['_angle'] <=> $b['_angle']);

        // Determine number of clusters
        $minClustersFromSize = (int)ceil($total / self::MAX_CLUSTER_SIZE);
        $clusterCount = max($minClustersFromSize, 1);
        
        // Don't create more clusters than vehicles (each cluster needs at least 1 vehicle)
        if ($vehicleCount > 0) {
            $clusterCount = min($clusterCount, $vehicleCount);
        }

        // Find optimal split point to avoid breaking up nearby deliveries at angle wrap-around
        $optimalStartIndex = $this->findOptimalClusterStart($withAngle);
        
        // Rotate array to start at optimal point
        if ($optimalStartIndex > 0) {
            $withAngle = array_merge(
                array_slice($withAngle, $optimalStartIndex),
                array_slice($withAngle, 0, $optimalStartIndex)
            );
        }

        $chunkSize = (int)ceil($total / $clusterCount);
        if ($chunkSize < 1) $chunkSize = 1;

        $clustersRaw = array_chunk($withAngle, $chunkSize);

        // Clean up clusters (remove internal _angle field)
        $clusters = [];
        foreach ($clustersRaw as $cluster) {
            $clean = [];
            foreach ($cluster as $d) {
                unset($d['_angle']);
                $clean[] = $d;
            }
            if (!empty($clean)) {
                $clusters[] = $clean;
            }
        }

        return $clusters;
    }

    /**
     * Find the index where the largest angular gap occurs
     * This is the best place to "cut" the circular arrangement
     */
    private function findOptimalClusterStart(array $sortedByAngle): int
    {
        if (count($sortedByAngle) < 2) {
            return 0;
        }

        $maxGap = 0;
        $maxGapIndex = 0;

        for ($i = 0; $i < count($sortedByAngle); $i++) {
            $currentAngle = $sortedByAngle[$i]['_angle'];
            $nextAngle = $sortedByAngle[($i + 1) % count($sortedByAngle)]['_angle'];
            
            // Calculate gap (handle wrap-around from π to -π)
            $gap = $nextAngle - $currentAngle;
            if ($gap < 0) {
                $gap += 2 * M_PI; // Wrap around
            }

            if ($gap > $maxGap) {
                $maxGap = $gap;
                $maxGapIndex = ($i + 1) % count($sortedByAngle);
            }
        }

        return $maxGapIndex;
    }

    /**
     * Allocate vehicles to clusters proportionally by size
     */
    private function allocateVehiclesForClusters(array $clusters, int $totalVehicles): array
    {
        $clusterCount = count($clusters);
        if ($clusterCount === 0) return [];

        // Ensure we have at least 1 vehicle
        if ($totalVehicles <= 0) {
            $totalVehicles = $clusterCount;
            Log::warning("No vehicles specified, defaulting to $totalVehicles (one per cluster)");
        }

        // Calculate total deliveries and each cluster's proportion
        $totalDeliveries = 0;
        foreach ($clusters as $cluster) {
            $totalDeliveries += count($cluster);
        }

        if ($totalDeliveries === 0) {
            return array_fill(0, $clusterCount, 1);
        }

        // Allocate vehicles proportionally to cluster size
        $alloc = [];
        $allocated = 0;

        foreach ($clusters as $i => $cluster) {
            $proportion = count($cluster) / $totalDeliveries;
            $vehiclesForCluster = (int)round($proportion * $totalVehicles);
            
            // Ensure at least 1 vehicle per cluster
            $vehiclesForCluster = max(1, $vehiclesForCluster);
            
            $alloc[$i] = $vehiclesForCluster;
            $allocated += $vehiclesForCluster;
        }

        // Adjust if we over/under allocated
        $diff = $totalVehicles - $allocated;
        
        if ($diff > 0) {
            // Add extra vehicles to largest clusters
            $clusterSizes = [];
            foreach ($clusters as $i => $cluster) {
                $clusterSizes[$i] = count($cluster);
            }
            arsort($clusterSizes);
            
            foreach (array_keys($clusterSizes) as $i) {
                if ($diff <= 0) break;
                $alloc[$i]++;
                $diff--;
            }
        } elseif ($diff < 0) {
            // Remove vehicles from smallest clusters (but keep at least 1)
            $clusterSizes = [];
            foreach ($clusters as $i => $cluster) {
                $clusterSizes[$i] = count($cluster);
            }
            asort($clusterSizes);
            
            foreach (array_keys($clusterSizes) as $i) {
                if ($diff >= 0) break;
                if ($alloc[$i] > 1) {
                    $alloc[$i]--;
                    $diff++;
                }
            }
        }

        return $alloc;
    }
}