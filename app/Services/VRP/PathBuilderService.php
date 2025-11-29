<?php

namespace App\Services\VRP;

class PathBuilderService
{
    /**
     * Convert VRP result (node indexes) into full map paths.
     *
     * @param array $routes          VRP solution from Clarke–Wright
     * @param array $points          nodeIds in matrix order
     * @param array $nodes           graph['nodes']
     * @param array $edges           graph['edges']
     *
     * @return array vehicles => [
     *     'vehicle_id' => x,
     *     'sequence' => [...],
     *     'steps' => [ ['x'=>..,'y'=>..], ... ],
     *     'full_path' => [ ['lat'=>..,'lng'=>..], ... ],
     *     'cost' => total cost
     * ]
     */
    public static function buildPaths(array $routes, array $points, array $nodes, array $edges, float $pixelValue)
    {
        $vehicles = [];

        foreach ($routes as $vehicleIndex => $vrpRoute) {
            $sequence = $vrpRoute['nodes'];
            $vehicleSteps = [];
            $vehicleFullPath = [];
            $totalCost = 0;

            for ($i = 0; $i < count($sequence) - 1; $i++) {
                
                $fromIdx = $sequence[$i];
                $toIdx   = $sequence[$i + 1];

                $fromNodeId = $points[$fromIdx];
                $toNodeId   = $points[$toIdx];

                // Run Dijkstra to get path between nodes
                $result = DijkstraService::shortestPath($edges, $fromNodeId, $toNodeId);

                $pathNodeIds = $result['path'];
                $totalCost += $result['cost'];

                // Convert nodeIDs to pixel coords
                foreach ($pathNodeIds as $nodeId) {
                    $vehicleSteps[] = $nodes[$nodeId];
                }

                if (empty($pathNodeIds)) {
    dd([
        'fromNodeId' => $fromNodeId,
        'toNodeId'   => $toNodeId,
        'dijkstra'   => $result,
        'edges_has_from' => isset($edges[$fromNodeId]),
        'edges_has_to'   => isset($edges[$toNodeId]),
    ]);
}
            }

            // Remove duplicate consecutive nodes
            $vehicleSteps = self::uniqueSteps($vehicleSteps);

            // Convert pixel → lat/lng for map
            foreach ($vehicleSteps as $p) {
                $vehicleFullPath[] = self::projectPoint($p['x'], $p['y']);
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

    //--------------------------
    // Helper: remove duplicates
    //--------------------------
    private static function uniqueSteps(array $steps): array
    {
        $unique = [];
        $last = null;

        foreach ($steps as $s) {
            $k = $s['x'] . '_' . $s['y'];

            if ($k !== $last) {
                $unique[] = $s;
                $last = $k;
            }
        }

        return $unique;
    }

    //--------------------------
    // Helper: projection (same as frontend)
    //--------------------------
    public static function projectPoint($x, $y)
    {
        $BASE_LAT = -15.78;
        $BASE_LNG = -47.93;
        $SCALE = 0.00005;

        return [
            'lat' => $BASE_LAT + $y * $SCALE,
            'lng' => $BASE_LNG + $x * $SCALE,
        ];
    }
}