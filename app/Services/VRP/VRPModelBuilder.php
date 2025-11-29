<?php

namespace App\Services\VRP;

class VRPModelBuilder
{
    /**
     * Build the VRP input model.
     *
     * @param array $matrixData     ['matrix'=>..., 'points'=>...]
     * @param int $vehicleCount
     * @param float $maxRouteCost
     *
     * @return array VRP model
     */
    public static function build(
        array $matrixData,
        int $vehicleCount,
        float $maxRouteCost
    ): array {

        $matrix = $matrixData['matrix'];
        $points = $matrixData['points'];

        return [
            'vehicleCount'    => $vehicleCount,
            'maxRouteCost'    => $maxRouteCost,
            'costMatrix'      => $matrix,
            'points'          => $points,           // nodeIds (depot first)
            'deliveryCount'   => count($points) - 1,
            'depotIndex'      => 0,                 // depot is always first
            'demands'         => array_fill(0, count($points), 1),
            'vehicleCapacity' => 9999999,           // optional (no capacity)
            'serviceTime'     => 0,                 // optional
            'returnToDepot'   => true,
        ];
    }
}