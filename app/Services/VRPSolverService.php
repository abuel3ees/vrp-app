<?php

namespace App\Services;

use App\Models\Delivery;
use App\Models\Instance;
use App\Models\Vehicle;

class VRPSolverService
{
    protected RoadNetworkService $roads;
    protected DijkstraService $dijkstra;

    public function __construct(RoadNetworkService $roads, DijkstraService $dijkstra)
    {
        $this->roads = $roads;
        $this->dijkstra = $dijkstra;
    }

    private function vehicleColor($i)
    {
        $colors = ['#FF0000', '#0066FF', '#00CC00', '#9900FF', '#FF9900', '#00CCCC'];
        return $colors[$i % count($colors)];
    }

    public function solve(Instance $instance)
    {
        $deliveries = Delivery::where('instance_id', $instance->id)->get();
        if ($deliveries->count() === 0) {
            return ['routes' => [], 'message' => 'No deliveries found.'];
        }

        $vehicles = Vehicle::where('instance_id', $instance->id)->get();
        if ($vehicles->count() === 0) {
            throw new \Exception("No vehicles exist for this instance.");
        }

        $graph = $this->roads->graph();

        // Split deliveries into clusters
        $chunkSize = max(1, ceil($deliveries->count() / $vehicles->count()));
        $clusters = array_chunk($deliveries->all(), $chunkSize);

        $routes = [];

        foreach ($clusters as $i => $cluster) {

            $vehicle = $vehicles[$i] ?? null;
            if (!$vehicle) break;

            // STEP 1 — Order with nearest-neighbor on raw coords
            $orderedDeliveries = $this->nearestNeighborGrid($cluster);

            // STEP 2 — Convert deliveries to graph node IDs
            $orderedNodes = [];
            foreach ($orderedDeliveries as $d) {
                $nearest = $this->roads->findNearestGraphNode($d->grid_x, $d->grid_y);
                if ($nearest) {
                    $orderedNodes[] = $nearest['id'];
                }
            }

            // STEP 3 — Compute full driving path via Dijkstra
            $fullGraphPath = [];
            for ($k = 0; $k < count($orderedNodes) - 1; $k++) {
                $from = $orderedNodes[$k];
                $to   = $orderedNodes[$k + 1];

                $res = $this->dijkstra->shortestPath($graph, $from, $to);

                if (!empty($res['path'])) {
                    $fullGraphPath = array_merge(
                        $fullGraphPath,
                        $res['path']
                    );
                }
            }

            // STEP 4 — Convert graph path IDs → coordinates
            $fullCoordPath = [];
            foreach ($fullGraphPath as $id) {
                $node = $this->roads->getNode($id);
                if ($node) {
                    $fullCoordPath[] = [
                        'x' => $node['x'],
                        'y' => $node['y']
                    ];
                }
            }

            // STEP 5 — Smooth animation frames
            $steps = [];
            for ($s = 0; $s < count($fullCoordPath) - 1; $s++) {
                $p1 = $fullCoordPath[$s];
                $p2 = $fullCoordPath[$s + 1];
                $frames = $this->interpolate($p1['x'], $p1['y'], $p2['x'], $p2['y'], 20);
                $steps = array_merge($steps, $frames);
            }

            // FINAL RETURN STRUCT
            $routes[] = [
                'vehicle_id'   => $vehicle->id,
                'vehicle_name' => $vehicle->name,
                'color'        => $this->vehicleColor($i),
                'full_path'    => $fullCoordPath,
                'steps'        => $steps
            ];
        }

        return $routes;
    }

    private function nearestNeighborGrid(array $deliveries)
    {
        $remaining = $deliveries;
        $start = array_shift($remaining);
        $order = [$start];

        while (!empty($remaining)) {
            $current = end($order);

            $cx = $current->grid_x;
            $cy = $current->grid_y;

            usort($remaining, function ($a, $b) use ($cx, $cy) {
                $da = hypot($a->grid_x - $cx, $a->grid_y - $cy);
                $db = hypot($b->grid_x - $cx, $b->grid_y - $cy);
                return $da <=> $db;
            });

            $order[] = array_shift($remaining);
        }

        return $order;
    }

    private function interpolate($x1, $y1, $x2, $y2, $steps = 20)
    {
        $frames = [];

        for ($i = 0; $i <= $steps; $i++) {
            $t = $i / $steps;

            $frames[] = [
                'x' => $x1 + ($x2 - $x1) * $t,
                'y' => $y1 + ($y2 - $y1) * $t
            ];
        }

        return $frames;
    }

    public function run($id)
    {
        $instance = Instance::findOrFail($id);
        $routes = $this->solve($instance);

        $instance->solution = json_encode($routes);
        $instance->save();

        return response()->json([
            'status'    => 'ok',
            'instance'  => $instance,
            'routes'    => $routes
        ]);
    }
}