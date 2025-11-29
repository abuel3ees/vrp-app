<?php

namespace App\Services\VRP;

class DistanceMatrixService
{
    /**
     * Build a full pairwise distance matrix.
     *
     * @param array $edges       Graph adjacency list
     * @param array $points      Array of nodeIds: ["3585_5015", "3200_4100", ...]
     *
     * @return array [
     *   'matrix' => [[float]],
     *   'points' => [nodeIds in matrix order]
     * ]
     */
    public static function build(array $edges, array $points): array
    {
        $n = count($points);
        $matrix = array_fill(0, $n, array_fill(0, $n, INF));

        for ($i = 0; $i < $n; $i++) {
            $source = $points[$i];

            for ($j = 0; $j < $n; $j++) {
                $target = $points[$j];

                if ($i === $j) {
                    $matrix[$i][$j] = 0;
                    continue;
                }

                // Run Dijkstra
                $res = DijkstraService::shortestPath($edges, $source, $target);
                $matrix[$i][$j] = $res['cost'];
            }
        }

        return [
            'matrix' => $matrix,
            'points' => $points
        ];
    }
}