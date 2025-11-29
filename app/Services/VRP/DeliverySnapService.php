<?php

namespace App\Services\VRP;

class DeliverySnapService
{
    /**
     * Snap each delivery point to the closest graph node.
     *
     * @param array $deliveries  [ ['x'=>..., 'y'=>..., 'id'=>...], ... ]
     * @param array $nodes       graph['nodes'] from GraphBuilder
     *
     * @return array [delivery_id => closestNodeId]
     */
    public static function snapDeliveries(array $deliveries, array $nodes): array
    {
        $mapping = [];

        foreach ($deliveries as $delivery) {
            $closestNode = null;
            $closestDist = INF;

            foreach ($nodes as $nodeId => $nodePoint) {
                $dx = $delivery['x'] - $nodePoint['x'];
                $dy = $delivery['y'] - $nodePoint['y'];

                $dist = $dx * $dx + $dy * $dy; // use squared distance for speed

                if ($dist < $closestDist) {
                    $closestDist = $dist;
                    $closestNode = $nodeId;
                }
            }

            $mapping[$delivery['id']] = $closestNode;
        }

        return $mapping;
    }
}