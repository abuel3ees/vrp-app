<?php

namespace App\Services;

class DijkstraService
{
    public function shortestPath(array $graph, string $start, string $end)
    {
        $dist = [];
        $prev = [];
        $queue = [];

        foreach ($graph as $vertex => $edges) {
            $dist[$vertex] = INF;
            $prev[$vertex] = null;
            $queue[$vertex] = INF;
        }

        $dist[$start] = 0;
        $queue[$start] = 0;

        while (!empty($queue)) {

            // Node with smallest distance
            $u = array_search(min($queue), $queue);
            if ($u === false) break;

            unset($queue[$u]);

            if ($u === $end) break;

            if (!isset($graph[$u])) continue;

            foreach ($graph[$u] as $v => $weight) {
                $alt = $dist[$u] + $weight;
                if ($alt < $dist[$v]) {
                    $dist[$v] = $alt;
                    $prev[$v] = $u;
                    $queue[$v] = $alt;
                }
            }
        }

        // Reconstruct path
        $path = [];
        $u = $end;

        while (isset($prev[$u]) && $prev[$u] !== null) {
            array_unshift($path, $u);
            $u = $prev[$u];
        }

        array_unshift($path, $start);

        return [
            'distance' => $dist[$end],
            'path' => $path
        ];
    }

    private function splitDeliveriesEvenly($deliveries, $vehicleCount)
{
    return array_chunk($deliveries, ceil(count($deliveries) / $vehicleCount));
}
}