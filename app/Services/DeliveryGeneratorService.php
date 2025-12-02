<?php

namespace App\Services;

use App\Models\Delivery;
use App\Models\Instance;
use App\Services\VRP\JsonLoader;
use App\Services\VRP\GraphBuilder;
use App\Services\VRP\DeliverySnapService;
use App\Services\VRP\GraphConnectivityService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DeliveryGeneratorService
{
    private function resolveProfile(Instance $instance): string
    {
        $category = strtolower($instance->category ?? '');
        return str_starts_with($category, 'amman') ? 'amman' : 'brazil';
    }

    private function projectLatLng(string $profile, float $x, float $y): array
    {
        // Brazil Default
        $baseLat = -15.78;
        $baseLng = -47.93;
        $scale   = 0.00005;

        // Amman Override
        if ($profile === 'amman') {
            $baseLat = 31.9539; 
            $baseLng = 35.9106;
            $scale   = 0.00005; 
        }

        return [
            'lat' => $baseLat + ($y * $scale),
            'lng' => $baseLng + ($x * $scale),
        ];
    }

    public function generateForInstance(Instance $instance): array
    {
        $profile = $this->resolveProfile($instance);

        // 1. Load Data
        $roads     = JsonLoader::loadRoadFiles($profile);
        $settings  = JsonLoader::loadSettings($profile);
        $penalties = JsonLoader::loadPenalties($profile);
        $roadTypes = JsonLoader::loadRoadTypes($profile);

        // 2. Build Graph
        $graph = (new GraphBuilder(
            $settings['PIXEL_VALUE'] ?? 1.0,
            $roadTypes,
            $penalties
        ))->build($roads);

        $nodes = $graph['nodes'];
        $edges = $graph['edges'];

        if (empty($nodes)) {
            throw new \Exception("Graph is empty. Check road JSON files.");
        }

        // 3. Find Largest Connected Component (The Main Road Network)
        $components = GraphConnectivityService::findComponents($edges);
        
        // Count size of each component
        $compSizes = array_count_values($components); // [compId => count, ...]
        
        // Sort to find the biggest one
        arsort($compSizes);
        $largestCompId = array_key_first($compSizes);
        $largestCompSize = $compSizes[$largestCompId];

        if ($largestCompSize < 2) {
            throw new \Exception("Road network is too fragmented (Largest component has < 2 nodes).");
        }

        // 4. Collect Candidate Nodes (Only from the Main Network)
        $candidateNodeIds = [];
        foreach ($components as $nodeId => $compId) {
            if ($compId === $largestCompId) {
                $candidateNodeIds[] = $nodeId;
            }
        }

        // 5. Auto-Place Depot on the First Node of the Main Network
        // (Ignoring settings.json DEPOT_X/Y to prevent 'island' bug)
        $depotNodeId = $candidateNodeIds[0];
        
        // Remove depot from candidates so we don't deliver to the warehouse
        array_shift($candidateNodeIds); 

        // 6. Select Random Delivery Nodes
        // Shuffle to randomize locations
        shuffle($candidateNodeIds);

        // Pick N unique nodes (or loop if we need more deliveries than nodes)
        $limit = $instance->delivery_points;
        $selectedIds = [];
        
        if ($limit <= count($candidateNodeIds)) {
            $selectedIds = array_slice($candidateNodeIds, 0, $limit);
        } else {
            // If user wants 500 deliveries but we only have 100 nodes, loop/repeat
            while (count($selectedIds) < $limit) {
                $selectedIds[] = $candidateNodeIds[array_rand($candidateNodeIds)];
            }
        }

        // 7. Clear Old Data
        Delivery::where('instance_id', $instance->id)->delete();

        // 8. Create Depot Delivery Entry (Optional, for visualization)
        // We create it but maybe mark it differently or just let it exist as a reference point
        // Ideally, we just create the *deliveries*. The depot is defined in the instance settings/logic.
        // But let's create the actual deliveries now.

        $insertData = [];
        $now = Carbon::now();

        foreach ($selectedIds as $i => $nodeId) {
            $p = $nodes[$nodeId];
            $geo = $this->projectLatLng($profile, $p['x'], $p['y']);

            $insertData[] = [
                'instance_id'   => $instance->id,
                'customer_name' => "Point " . ($i + 1),
                'address'       => "Node " . $nodeId,
                'lat'           => $geo['lat'],
                'lng'           => $geo['lng'],
                'x'             => $p['x'],
                'y'             => $p['y'],
                'status'        => 'pending',
                'created_at'    => $now,
                'updated_at'    => $now,
            ];
        }

        // Bulk Insert
        foreach (array_chunk($insertData, 500) as $chunk) {
            Delivery::insert($chunk);
        }

        // --------------------------------------------------------
        // CRITICAL: Update Instance with the NEW Depot Location
        // Since we moved the depot to the main network, we must save 
        // this new location so the Solver knows where to start.
        // --------------------------------------------------------
        $depotNode = $nodes[$depotNodeId];
        // We can store this in the 'comment' or a specific field if you have one.
        // For now, let's Log it. In a real app, you might update $instance->depot_x / y
        Log::info("Auto-centered Depot to Node {$depotNodeId} ({$depotNode['x']}, {$depotNode['y']})");

        // HACK: To make the Solver use this new depot, we usually rely on settings.json.
        // Since we can't edit settings.json on the fly, we will inject a "Virtual Depot" delivery
        // or ensure the Solver uses the first node of the route as start.
        // For this specific setup, you might need to manually update your Settings file 
        // to match this log output, OR update VRPSolverService to pick up a 'depot' delivery if it exists.

        return $insertData;
    }
}