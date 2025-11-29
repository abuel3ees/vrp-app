<?php

namespace App\Services\VRP;

class DijkstraService
{
    /**
     * Compute the shortest path between two nodes.
     *
     * @param array $edges     Graph edges: nodeId => [ ['to'=>id, 'weightedCost'=>x], ... ]
     * @param string $sourceId Starting node ID
     * @param string $targetId Ending node ID
     * @return array {
     *   'cost' => float,
     *   'path' => array of node IDs
     * }
     */
    public static function shortestPath(array $edges, string $sourceId, string $targetId): array
    {
        $dist = [];
        $prev = [];
        $visited = [];
        
        // Min priority queue (cost, node)
        $queue = new \SplPriorityQueue();
        // SplPriorityQueue extracts max by default, so invert priority
        $queue->setExtractFlags(\SplPriorityQueue::EXTR_DATA);

        // Initialize distances
        foreach ($edges as $node => $_) {
            $dist[$node] = INF;
        }

        $dist[$sourceId] = 0;
        $queue->insert($sourceId, 0);

        while (!$queue->isEmpty()) {
            $current = $queue->extract();
            
            if (isset($visited[$current])) continue;
            $visited[$current] = true;

            if ($current === $targetId) break;

            if (!isset($edges[$current])) continue;

            foreach ($edges[$current] as $edge) {
                $neighbor = $edge['to'];
                $cost = $edge['weightedCost'];

                $newDist = $dist[$current] + $cost;

                if ($newDist < $dist[$neighbor]) {
                    $dist[$neighbor] = $newDist;
                    $prev[$neighbor] = $current;

                    // use negative because SplPriorityQueue is max-heap
                    $queue->insert($neighbor, -$newDist);
                }
            }
        }

        // If no path exists
        if ($dist[$targetId] === INF) {
            return [ 'cost' => INF, 'path' => [] ];
        }

        // Reconstruct path
        $path = [];
        $current = $targetId;

        while (isset($prev[$current])) {
            array_unshift($path, $current);
            $current = $prev[$current];
        }

        // Add the source
        array_unshift($path, $sourceId);

        return [
            'cost' => $dist[$targetId],
            'path' => $path
        ];
    }
}