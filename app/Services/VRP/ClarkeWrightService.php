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

        $depot = 0; 

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
                // S_ij = C_i0 + C_0j - C_ij
                $saving = $matrix[$depot][$i] + $matrix[$depot][$j] - $matrix[$i][$j];
                $savings[] = [
                    'i'      => $i,
                    'j'      => $j,
                    'saving' => $saving,
                ];
            }
        }

        usort($savings, fn ($a, $b) => $b['saving'] <=> $a['saving']);

        // ---------------------------------------------
        // STEP 3: Merge routes
        // ---------------------------------------------
        foreach ($savings as $s) {
            $i = $s['i'];
            $j = $s['j'];

            $ri = null;
            $rj = null;

            foreach ($routes as $key => $r) {
                if (in_array($i, $r['nodes'], true)) $ri = $key;
                if (in_array($j, $r['nodes'], true)) $rj = $key;
            }

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

            // Case 1: End of A connects to Start of B
            if ($endA === $i && $startB === $j) {
                $newNodes = array_merge(
                    [$depot],
                    array_slice($nodesA, 1, -1),
                    array_slice($nodesB, 1, -1),
                    [$depot]
                );
            }
            // Case 2: End of B connects to Start of A
            elseif ($endB === $j && $startA === $i) {
                $newNodes = array_merge(
                    [$depot],
                    array_slice($nodesB, 1, -1),
                    array_slice($nodesA, 1, -1),
                    [$depot]
                );
            }

            if ($newNodes === null) continue;

            $cost = self::computeCost($newNodes, $matrix);

            if ($cost > $maxRouteCost) continue;

            unset($routes[$ri], $routes[$rj]);
            
            // Use one of the old keys or a new one
            $routes[$i] = [
                'nodes' => $newNodes,
                'cost'  => $cost,
            ];
        }

        // ---------------------------------------------
        // STEP 4: Reduce routes if > vehicleCount
        // ---------------------------------------------
        while (count($routes) > $vehicleCount) {
            uasort($routes, fn ($a, $b) => $a['cost'] <=> $b['cost']);
            $keys = array_keys($routes);
            $k1   = $keys[0];
            $k2   = $keys[1];

            $r1 = $routes[$k1];
            $r2 = $routes[$k2];

            $try = array_merge(
                [$depot],
                array_slice($r1['nodes'], 1, -1),
                array_slice($r2['nodes'], 1, -1),
                [$depot]
            );

            $cost = self::computeCost($try, $matrix);

            if ($cost <= $maxRouteCost) {
                unset($routes[$k1], $routes[$k2]);
                $routes[$k1] = ['nodes' => $try, 'cost'  => $cost];
            } else {
                break;
            }
        }

        // ---------------------------------------------
        // STEP 5: Expand/Split if < vehicleCount
        // ---------------------------------------------
        $routes = array_values($routes);
        if (count($routes) < $vehicleCount) {
            $routes = self::expandToVehicleCount($routes, $vehicleCount, $matrix, $maxRouteCost, $depot);
        }

        // Hard cap
        if (count($routes) > $vehicleCount) {
            // Sort by cost descending (remove most expensive? or keep cheapest? usually keep cheapest)
            uasort($routes, fn($a,$b) => $a['cost'] <=> $b['cost']);
            $routes = array_slice($routes, 0, $vehicleCount);
        }

        return array_values($routes);
    }

    private static function computeCost(array $nodes, array $matrix): float
    {
        $cost = 0.0;
        $count = count($nodes);
        for ($i = 0; $i < $count - 1; $i++) {
            $cost += $matrix[$nodes[$i]][$nodes[$i + 1]];
        }
        return $cost;
    }

    private static function expandToVehicleCount(
        array $routes,
        int $vehicleCount,
        array $matrix,
        float $maxRouteCost,
        int $depotIndex
    ): array {
        
        while (count($routes) < $vehicleCount) {
            $maxIdx = null;
            $maxCustomers = 0;

            foreach ($routes as $idx => $r) {
                $customers = max(count($r['nodes']) - 2, 0);
                if ($customers > $maxCustomers) {
                    $maxCustomers = $customers;
                    $maxIdx = $idx;
                }
            }

            if ($maxIdx === null || $maxCustomers <= 1) break;

            $route = $routes[$maxIdx];
            $nodes = $route['nodes'];
            $customers = array_slice($nodes, 1, -1);
            
            $half = intdiv(count($customers), 2);
            if ($half < 1) break;

            $custA = array_slice($customers, 0, $half);
            $custB = array_slice($customers, $half);

            $nodesA = array_merge([$depotIndex], $custA, [$depotIndex]);
            $nodesB = array_merge([$depotIndex], $custB, [$depotIndex]);

            $costA = self::computeCost($nodesA, $matrix);
            $costB = self::computeCost($nodesB, $matrix);

            if ($costA > $maxRouteCost || $costB > $maxRouteCost) {
                // If we can't split the biggest route without violating constraints, stop trying
                break;
            }

            unset($routes[$maxIdx]);
            
            $routes[] = [
                'nodes' => $nodesA,
                'cost'  => $costA,
            ];
            
            $routes[] = [
                'nodes' => $nodesB,
                'cost'  => $costB,
            ]; // <--- FIXED: Added closing bracket and semicolon

            $routes = array_values($routes);
        }

        return $routes;
    }
}