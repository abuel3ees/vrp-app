<?php

namespace App\Services;

use App\Models\Delivery;
use App\Models\Instance;
use App\Services\VRP\JsonLoader;
use App\Services\VRP\GraphBuilder;
use App\Services\VRP\DeliverySnapService;
use App\Services\VRP\GraphConnectivityService;
use App\Services\VRP\PathBuilderService;

class DeliveryGeneratorService
{
    private const BASE_LAT = -15.78;
    private const BASE_LNG = -47.93;
    private const SCALE = 0.00005;

    /**
     * Convert pixel x/y → lat/lng.
     */
    private function projectLatLng($x, $y)
    {
        return [
            'lat' => self::BASE_LAT + $y * self::SCALE,
            'lng' => self::BASE_LNG + $x * self::SCALE,
        ];
    }

    /**
     * Main generator: creates fake deliveries on the map grid.
     */
    public function generateForInstance(Instance $instance): array
    {
        // 1) Load road network + settings
        $roads     = JsonLoader::loadRoadFiles();
        $settings  = JsonLoader::loadSettings();
        $penalties = JsonLoader::loadPenalties();
        $roadTypes = JsonLoader::loadRoadTypes();

        // 2) Build graph
        $graph = (new GraphBuilder(
            $settings['PIXEL_VALUE'],
            $roadTypes,
            $penalties
        ))->build($roads);

        $nodes = $graph['nodes'];
        $edges = $graph['edges'];

        // 3) Snap depot to nearest node
        $depotPoint = [
            'x' => $settings['DEPOT_X'],
            'y' => $settings['DEPOT_Y'],
        ];

        $depotSnap = DeliverySnapService::snapDeliveries(
            [
                [
                    'id' => 'depot',
                    'x'  => $depotPoint['x'],
                    'y'  => $depotPoint['y'],
                ]
            ],
            $nodes
        );

        $depotNodeId = $depotSnap['depot'];

        // 4) Compute connected components & find depot component
        $components = GraphConnectivityService::findComponents($edges);

        if (!isset($components[$depotNodeId])) {
            throw new \Exception("Depot node {$depotNodeId} not found in graph components.");
        }

        $depotComp = $components[$depotNodeId];

        // 5) Candidate nodes = all nodes in same component as depot
        $candidateNodeIds = [];
        foreach ($components as $nodeId => $compIndex) {
            if ($compIndex === $depotComp) {
                $candidateNodeIds[] = $nodeId;
            }
        }

        if (empty($candidateNodeIds)) {
            throw new \Exception("No candidate nodes found in depot component.");
        }

        // (Optional) You can further filter by distance from depot if you want.

        // 6) Clear existing deliveries for this instance
        Delivery::where('instance_id', $instance->id)->delete();

        // 7) Create deliveries ON graph nodes
        $created = [];

        for ($i = 1; $i <= $instance->delivery_points; $i++) {
            $nodeId = $candidateNodeIds[array_rand($candidateNodeIds)];
            $p      = $nodes[$nodeId]; // ['x' => ..., 'y' => ...]

            $geo = PathBuilderService::projectPoint($p['x'], $p['y']);

            $created[] = Delivery::create([
                'instance_id'   => $instance->id,
                'customer_name' => "Point $i",
                'address'       => "Road node $nodeId",
                'lat'           => $geo['lat'],
                'lng'           => $geo['lng'],
                'x'             => $p['x'],
                'y'             => $p['y'],
                'status'        => 'pending',
            ]);
        }

        return $created;
    }
}