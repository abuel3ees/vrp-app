<?php

namespace App\Services\VRP;

class DistanceMatrixService
{
    public static function build(array $edges, array $points): array
    {
        $n = count($points);
        // Initialize matrix with INF
        $matrix = array_fill(0, $n, array_fill(0, $n, INF));

        for ($i = 0; $i < $n; $i++) {
            $source = $points[$i];

            // OPTIMIZATION: Run Dijkstra ONCE per row (One-to-All)
            // Instead of running it N times per row.
            $distances = DijkstraService::findAllDistances($edges, $source);

            for ($j = 0; $j < $n; $j++) {
                if ($i === $j) {
                    $matrix[$i][$j] = 0;
                    continue;
                }

                $target = $points[$j];
                
                // Lookup cost in the calculated array. 
                // If target not reachable, it stays INF.
                if (isset($distances[$target])) {
                    $matrix[$i][$j] = $distances[$target];
                }
            }
        }

        return [
            'matrix' => $matrix,
            'points' => $points
        ];
    }
}