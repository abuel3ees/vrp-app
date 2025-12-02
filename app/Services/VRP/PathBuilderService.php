<?php

namespace App\Services\VRP;

class PathBuilderService
{
    /**
     * Now accepts explicit projection parameters ($baseLat, $baseLng, $scale)
     */
    public static function buildPaths(
        array $routes, 
        array $points, 
        array $nodes, 
        array $edges, 
        float $pixelValue, // Used for cost calculation
        float $baseLat,    // New
        float $baseLng,    // New
        float $scale       // New
    ) {
        $vehicles = [];

        foreach ($routes as $vehicleIndex => $vrpRoute) {
            $sequence        = $vrpRoute['nodes'];
            $vehicleSteps    = [];
            $vehicleFullPath = [];
            $totalCost       = 0;

            for ($i = 0; $i < count($sequence) - 1; $i++) {
                $fromIdx = $sequence[$i];
                $toIdx   = $sequence[$i + 1];

                $fromNodeId = $points[$fromIdx];
                $toNodeId   = $points[$toIdx];

                // 1. Get path from graph
                $result = DijkstraService::shortestPath($edges, $fromNodeId, $toNodeId);

                // 2. Handle disconnected graph (Teleport fallback)
                if (empty($result['path'])) {
                    $p1 = $nodes[$fromNodeId];
                    $p2 = $nodes[$toNodeId];
                    $vehicleSteps[] = $p1;
                    $vehicleSteps[] = $p2;
                    // Straight line distance cost
                    $dist = sqrt(($p1['x']-$p2['x'])**2 + ($p1['y']-$p2['y'])**2);
                    $totalCost += ($dist * $pixelValue);
                } else {
                    $pathNodeIds = $result['path'];
                    $totalCost  += $result['cost'];
                    foreach ($pathNodeIds as $nodeId) {
                        $vehicleSteps[] = $nodes[$nodeId];
                    }
                }
            }

            // 3. Clean steps
            $vehicleSteps = self::uniqueSteps($vehicleSteps);

            // 4. Project steps to Lat/Lng using passed arguments
            foreach ($vehicleSteps as $p) {
                $vehicleFullPath[] = [
                    'lat' => $baseLat + ($p['y'] * $scale),
                    'lng' => $baseLng + ($p['x'] * $scale),
                ];
            }

            $vehicles[] = [
                'vehicle_id'  => $vehicleIndex + 1,
                'sequence'    => $sequence,
                'steps'       => $vehicleSteps,
                'full_path'   => $vehicleFullPath,
                'cost'        => $totalCost,
            ];
        }

        return $vehicles;
    }

    private static function uniqueSteps(array $steps): array
    {
        $unique = [];
        $last   = null;
        foreach ($steps as $s) {
            $k = $s['x'] . '_' . $s['y'];
            if ($k !== $last) {
                $unique[] = $s;
                $last     = $k;
            }
        }
        return $unique;
    }
}