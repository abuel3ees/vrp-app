<?php

namespace App\Services\VRP;

use SplPriorityQueue;

class DijkstraService
{
    /**
     * Compute shortest paths from source to ALL other nodes.
     * Returns array: [nodeId => cost]
     */
    public static function findAllDistances(array $edges, string $sourceId): array
    {
        $dist = [];
        $visited = [];
        
        // Use SplPriorityQueue for O(log V) extractions
        $queue = new SplPriorityQueue();
        $queue->setExtractFlags(SplPriorityQueue::EXTR_DATA);

        // We only initialize the source distance; others are implicitly INF
        $dist[$sourceId] = 0;
        $queue->insert($sourceId, 0);

        while (!$queue->isEmpty()) {
            $current = $queue->extract();

            if (isset($visited[$current])) continue;
            $visited[$current] = true;

            if (!isset($edges[$current])) continue;

            foreach ($edges[$current] as $edge) {
                $neighbor = $edge['to'];
                $cost = $edge['weightedCost']; // Using pre-calculated weighted cost
                
                // Current known distance to neighbor (default INF)
                $currentDistToNeighbor = $dist[$neighbor] ?? INF;
                $newDist = $dist[$current] + $cost;

                if ($newDist < $currentDistToNeighbor) {
                    $dist[$neighbor] = $newDist;
                    // Priority is negative because SplPriorityQueue is a Max-Heap
                    $queue->insert($neighbor, -$newDist);
                }
            }
        }

        return $dist;
    }

    /**
     * Standard point-to-point (stops when target found).
     */
    public static function shortestPath(array $edges, string $sourceId, string $targetId): array
    {
        $dist = [];
        $prev = [];
        $visited = [];
        
        $queue = new SplPriorityQueue();
        $queue->setExtractFlags(SplPriorityQueue::EXTR_DATA);

        $dist[$sourceId] = 0;
        $queue->insert($sourceId, 0);

        while (!$queue->isEmpty()) {
            $current = $queue->extract();
            
            if ($current === $targetId) break; // Optimization: Stop early
            
            if (isset($visited[$current])) continue;
            $visited[$current] = true;

            if (!isset($edges[$current])) continue;

            foreach ($edges[$current] as $edge) {
                $neighbor = $edge['to'];
                $cost = $edge['weightedCost'];
                
                $curD = $dist[$neighbor] ?? INF;
                $newD = ($dist[$current] ?? INF) + $cost;

                if ($newD < $curD) {
                    $dist[$neighbor] = $newD;
                    $prev[$neighbor] = $current;
                    $queue->insert($neighbor, -$newD);
                }
            }
        }

        if (!isset($dist[$targetId]) || $dist[$targetId] === INF) {
            return [ 'cost' => INF, 'path' => [] ];
        }

        // Reconstruct
        $path = [];
        $curr = $targetId;
        while (isset($prev[$curr])) {
            array_unshift($path, $curr);
            $curr = $prev[$curr];
        }
        array_unshift($path, $sourceId);

        return [
            'cost' => $dist[$targetId],
            'path' => $path
        ];
    }
}