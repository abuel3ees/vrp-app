<?php

namespace App\Services\VRP;

class DeliverySnapService
{
    /**
     * Snap deliveries using a spatial grid optimization.
     */
    public static function snapDeliveries(array $deliveries, array $nodes): array
    {
        $mapping = [];
        
        // 1. Build Spatial Grid (Bucket Sort)
        // Grid size depends on your pixel scale. 500 is usually a good balance.
        $cellSize = 500; 
        $grid = [];

        foreach ($nodes as $nodeId => $p) {
            $gx = (int) floor($p['x'] / $cellSize);
            $gy = (int) floor($p['y'] / $cellSize);
            $grid[$gx][$gy][] = $nodeId;
        }

        // 2. Snap each delivery
        foreach ($deliveries as $delivery) {
            $dx = $delivery['x'];
            $dy = $delivery['y'];

            $gx = (int) floor($dx / $cellSize);
            $gy = (int) floor($dy / $cellSize);

            $candidates = [];

            // Check 3x3 grid around the point
            for ($ix = $gx - 1; $ix <= $gx + 1; $ix++) {
                for ($iy = $gy - 1; $iy <= $gy + 1; $iy++) {
                    if (isset($grid[$ix][$iy])) {
                        foreach ($grid[$ix][$iy] as $nId) {
                            $candidates[] = $nId;
                        }
                    }
                }
            }

            // Fallback: If grid is empty around point (sparse map), search everything
            if (empty($candidates)) {
                $candidates = array_keys($nodes);
            }

            // Standard nearest neighbor on candidates
            $closestNode = null;
            $minDist = INF;

            foreach ($candidates as $nodeId) {
                $np = $nodes[$nodeId];
                $distSq = ($dx - $np['x'])**2 + ($dy - $np['y'])**2;

                if ($distSq < $minDist) {
                    $minDist = $distSq;
                    $closestNode = $nodeId;
                }
            }

            $mapping[$delivery['id']] = $closestNode;
        }

        return $mapping;
    }
}