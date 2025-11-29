<?php

namespace App\Services\VRP;

class GraphConnectivityService
{
    /**
     * Return array: nodeId => componentIndex
     */
    public static function findComponents(array $edges): array
    {
        $visited   = [];
        $component = [];
        $compIndex = 0;

        foreach ($edges as $nodeId => $_) {
            if (isset($visited[$nodeId])) continue;

            $queue = [$nodeId];
            $visited[$nodeId] = true;

            while (!empty($queue)) {
                $current = array_shift($queue);
                $component[$current] = $compIndex;

                foreach ($edges[$current] as $edge) {
                    $next = $edge['to'];
                    if (!isset($visited[$next])) {
                        $visited[$next] = true;
                        $queue[] = $next;
                    }
                }
            }

            $compIndex++;
        }

        return $component;
    }


    /**
     * Build minimal virtual edges between components
     */
    public static function buildVirtualEdges(array $edges, array $nodes, float $virtualCost = 300): array
    {
        $components = self::findComponents($edges);

        // Group nodes by component
        $groups = [];
        foreach ($components as $nodeId => $compIdx) {
            $groups[$compIdx][] = $nodeId;
        }

        // If only one connected component → no need for virtual edges
        if (count($groups) <= 1) {
            return $edges;
        }

        // Choose representative node from each group
        $centers = [];
        foreach ($groups as $compIdx => $nodeList) {
            $centers[$compIdx] = $nodeList[0];
        }

        // Add virtual edges between every pair of components
        $groupIds = array_keys($groups);

        for ($i = 0; $i < count($groupIds); $i++) {
            for ($j = $i + 1; $j < count($groupIds); $j++) {

                $a = $centers[$groupIds[$i]];
                $b = $centers[$groupIds[$j]];

                // Add bidirectional virtual edges
                $edges[$a][] = [
                    'to' => $b,
                    'baseCost' => $virtualCost,
                    'weightedCost' => $virtualCost,
                    'roadType' => 'VIRTUAL',
                    'tags' => [],
                ];

                $edges[$b][] = [
                    'to' => $a,
                    'baseCost' => $virtualCost,
                    'weightedCost' => $virtualCost,
                    'roadType' => 'VIRTUAL',
                    'tags' => [],
                ];
            }
        }

        return $edges;
    }
}