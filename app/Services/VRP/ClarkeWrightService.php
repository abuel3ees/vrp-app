<?php

namespace App\Services\VRP;

class ClarkeWrightService
{
    public static function solve(array $vrp)
    {
        $matrix       = $vrp['costMatrix'];
        $points       = $vrp['points']; // nodeIds
        $n            = count($points);
        $vehicleCount = $vrp['vehicleCount'];
        $maxRouteCost = $vrp['maxRouteCost'];

        $depot = 0; // depot index

        // ---------------------------------------------
        // STEP 1: Initialize routes (each delivery alone)
        // ---------------------------------------------
        $routes = [];

        for ($i = 1; $i < $n; $i++) {
            $routes[$i] = [
                'nodes' => [$depot, $i, $depot],
                'cost'  => $matrix[$depot][$i] + $matrix[$i][$depot],
            ];
        }

        // ---------------------------------------------
        // STEP 2: Compute savings
        // ---------------------------------------------
        $savings = [];

        for ($i = 1; $i < $n; $i++) {
            for ($j = $i + 1; $j < $n; $j++) {
                $saving = $matrix[$depot][$i] + $matrix[$depot][$j] - $matrix[$i][$j];
                $savings[] = [
                    'i'      => $i,
                    'j'      => $j,
                    'saving' => $saving,
                ];
            }
        }

        // Highest savings first
        usort($savings, fn ($a, $b) => $b['saving'] <=> $a['saving']);

        // ---------------------------------------------
        // STEP 3: Merge routes based on savings
        // ---------------------------------------------
        foreach ($savings as $s) {
            $i = $s['i'];
            $j = $s['j'];

            // Find routes that currently contain i and j
            $ri = null;
            $rj = null;

            foreach ($routes as $key => $r) {
                if (in_array($i, $r['nodes'], true)) $ri = $key;
                if (in_array($j, $r['nodes'], true)) $rj = $key;
            }

            // If i and j are already in the same route or not found, skip
            if ($ri === null || $rj === null || $ri === $rj) {
                continue;
            }

            $routeA = $routes[$ri];
            $routeB = $routes[$rj];

            $nodesA = $routeA['nodes'];
            $nodesB = $routeB['nodes'];

            $startA = $nodesA[1];
            $endA   = $nodesA[count($nodesA) - 2];

            $startB = $nodesB[1];
            $endB   = $nodesB[count($nodesB) - 2];

            $newNodes = null;

            // Case 1: A ... i, B j ...
            if ($endA === $i && $startB === $j) {
                $newNodes = array_merge(
                    [$depot],
                    array_slice($nodesA, 1, -1),
                    array_slice($nodesB, 1, -1),
                    [$depot]
                );
            }
            // Case 2: B ... j, A i ...
            elseif ($endB === $j && $startA === $i) {
                $newNodes = array_merge(
                    [$depot],
                    array_slice($nodesB, 1, -1),
                    array_slice($nodesA, 1, -1),
                    [$depot]
                );
            }

            if ($newNodes === null) {
                continue;
            }

            // Compute new route cost
            $cost = self::computeCost($newNodes, $matrix);

            // Enforce route cost limit
            if ($cost > $maxRouteCost) {
                continue;
            }

            // Merge successful: remove old routes and insert new one
            unset($routes[$ri], $routes[$rj]);
            $routes[$i] = [
                'nodes' => $newNodes,
                'cost'  => $cost,
            ];
        }

        // ---------------------------------------------
        // STEP 4: Reduce routes if more than vehicles
        // ---------------------------------------------
        while (count($routes) > $vehicleCount) {
            // Sort by cost ascending
            uasort($routes, fn ($a, $b) => $a['cost'] <=> $b['cost']);

            $keys = array_keys($routes);
            $k1   = $keys[0];
            $k2   = $keys[1];

            $r1 = $routes[$k1];
            $r2 = $routes[$k2];

            $nodes1 = $r1['nodes'];
            $nodes2 = $r2['nodes'];

            $try = array_merge(
                [$depot],
                array_slice($nodes1, 1, -1),
                array_slice($nodes2, 1, -1),
                [$depot]
            );

            $cost = self::computeCost($try, $matrix);

            if ($cost <= $maxRouteCost) {
                unset($routes[$k1], $routes[$k2]);
                $routes[$k1] = [
                    'nodes' => $try,
                    'cost'  => $cost,
                ];
            } else {
                break;
            }
        }

        // ---------------------------------------------
        // STEP 5: If FEWER routes than vehicles → split big ones
        // ---------------------------------------------
        $routes = array_values($routes);

        if (count($routes) < $vehicleCount) {
            $routes = self::expandToVehicleCount($routes, $vehicleCount, $matrix, $maxRouteCost, $depot);
        }

        // If STILL more, hard-cap
        if (count($routes) > $vehicleCount) {
            $routes = array_slice($routes, 0, $vehicleCount);
        }

        return $routes;
    }

    // -------------------------------
    // Helper: compute route cost
    // -------------------------------
    private static function computeCost(array $nodes, array $matrix): float
    {
        $cost = 0.0;
        $count = count($nodes);

        for ($i = 0; $i < $count - 1; $i++) {
            $from = $nodes[$i];
            $to   = $nodes[$i + 1];

            $cost += $matrix[$from][$to];
        }

        return $cost;
    }

    // -------------------------------
    // Helper: expand routes by splitting
    // -------------------------------
    private static function expandToVehicleCount(
        array $routes,
        int $vehicleCount,
        array $matrix,
        float $maxRouteCost,
        int $depotIndex = 0
    ): array {
        // Keep trying to split the longest route until:
        // - we reach vehicleCount, or
        // - all routes have at most 1 customer
        while (count($routes) < $vehicleCount) {
            // Find route with most customers
            $maxIdx      = null;
            $maxCustomers = 0;

            foreach ($routes as $idx => $r) {
                // nodes: [0, a, b, c, 0] -> customers = 3
                $customers = max(count($r['nodes']) - 2, 0);
                if ($customers > $maxCustomers) {
                    $maxCustomers = $customers;
                    $maxIdx       = $idx;
                }
            }

            // Nothing to split (all routes have 0 or 1 customer)
            if ($maxIdx === null || $maxCustomers <= 1) {
                break;
            }

            $route = $routes[$maxIdx];
            $nodes = $route['nodes'];

            // Extract customer indices (skip first/last depot)
            $customers = array_slice($nodes, 1, -1);
            $totalCust = count($customers);

            $half = intdiv($totalCust, 2);
            if ($half < 1) {
                break;
            }

            $custA = array_slice($customers, 0, $half);
            $custB = array_slice($customers, $half);

            $nodesA = array_merge([$depotIndex], $custA, [$depotIndex]);
            $nodesB = array_merge([$depotIndex], $custB, [$depotIndex]);

            $costA = self::computeCost($nodesA, $matrix);
            $costB = self::computeCost($nodesB, $matrix);

            // If splitting violates cost constraint, give up
            if ($costA > $maxRouteCost || $costB > $maxRouteCost) {
                break;
            }

            // Replace original with A, append B
            unset($routes[$maxIdx]);
            $routes[] = [
                'nodes' => $nodesA,
                'cost'  => $costA,
            ];
            $routes[] = [
                'nodes' => $nodesB,
                'cost'  => $costB,
            ];

            // Reindex for next loop
            $routes = array_values($routes);
        }

        return $routes;
    }
}