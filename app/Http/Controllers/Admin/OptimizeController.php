<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Process;

class OptimizeController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Optimize');
    }

    public function run(Request $request)
    {
        set_time_limit(300);
        $id = $request->input('instance_id');
        $solver = $request->input('solver'); // 'classical' or 'quantum'

        // 1. Load instance data
        $data = $this->getInstanceData($id);

        // 2. Prepare payload for Python (OR-Tools)
        $payload = json_encode([
            'matrix'   => $data['matrix'],
            'vehicles' => $data['vehicles'],
        ]);

        // 3. Select solver script
        $scriptName = $solver === 'quantum' ? 'quantum.py' : 'classical.py';
        $scriptPath = storage_path("app/solvers/{$scriptName}");

        $output = null;
        $error = null;

        // 4. Run Python solver
$python = '/Users/abdurahmanal-essa/work/vrpappfr/vrp_app_v2/venv/bin/python3';
$result = Process::timeout(120)
    ->input($payload) // ✅ send JSON via STDIN
    ->run($python . ' ' . escapeshellarg($scriptPath));

$rawOut = trim($result->output());
$rawErr = trim($result->errorOutput());

if ($rawOut === '') {
    throw new \RuntimeException(
        'Solver returned empty output. STDERR: ' . $rawErr
    );
}

$output = json_decode($rawOut, true);

if (!isset($output['status']) || $output['status'] === 'error') {
    dd([
        'PHP_Status' => 'Falling back to greedy because:',
        'Python_Output' => $output,
        'Raw_Output' => $rawOut,
        'Raw_Error_Stream' => $rawErr
    ]);
}

if (json_last_error() !== JSON_ERROR_NONE) {
    throw new \RuntimeException(
        'Invalid JSON from solver: ' . json_last_error_msg() .
        ' | RAW: ' . $rawOut
    );
}

        // 5. Decide solver vs fallback
        $routes = [];
        $usedFallback = false;

        if (
            $output &&
            isset($output['status']) &&
            in_array($output['status'], ['feasible', 'optimal', 'success'], true) &&
            isset($output['routes'])
        ) {
            // OR-Tools (or valid solver) result
            $routes = $this->formatRoutes($output['routes'], $data['nodes']);
        } else {
            // Hard fallback (Python crash or no solution)
            $routes = $this->generateGreedyRoutes($data['nodes'], $data['vehicles']);
            $usedFallback = true;
        }

        return Inertia::render('admin/Routes', [
            'instance' => [
                'id'          => $id,
                'name'        => $data['name'],
                'category'    => $solver === 'quantum'
                    ? 'Quantum Optimization'
                    : 'Operations Research (OR-Tools)',
                'is_fallback' => $usedFallback,
                'error_log'   => $error,
            ],
            'nodes'  => $data['nodes'],
            'routes' => $routes,
        ]);
    }

    // ---------------- HELPERS ----------------

    private function formatRoutes(array $rawRoutes, array $nodes): array
    {
        $formatted = [];
        $colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

        foreach ($rawRoutes as $i => $route) {
            $steps = [];
            $fullPath = [];

            foreach ($route['path'] as $idx) {
                if (!isset($nodes[$idx])) {
                    continue;
                }

                $node = $nodes[$idx];
                $steps[] = ['x' => $node['x'], 'y' => $node['y']];
                $fullPath[] = ['lat' => $node['lat'], 'lng' => $node['lng']];
            }

            $formatted[] = [
                'id'             => $i + 1,
                'vehicle_number' => $route['vehicle'] + 1,
                'deliveries'     => array_slice($route['path'], 1, -1),
                'steps'          => $steps,
                'full_path'      => $fullPath,
                'cost'           => $route['cost'],
                'color'          => $colors[$i % count($colors)],
            ];
        }

        return $formatted;
    }

    private function generateGreedyRoutes(array $nodes, int $vehicleCount): array
    {
        $routes = [];
        $colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

        $depot = $nodes[0];
        $customers = array_slice($nodes, 1);
        $chunks = array_chunk($customers, max(1, ceil(count($customers) / $vehicleCount)));

        foreach ($chunks as $i => $chunk) {
            $steps = [];
            $fullPath = [];
            $deliveries = [];

            $steps[] = ['x' => $depot['x'], 'y' => $depot['y']];
            $fullPath[] = ['lat' => $depot['lat'], 'lng' => $depot['lng']];

            foreach ($chunk as $node) {
                $deliveries[] = $node['id'];
                $steps[] = ['x' => $node['x'], 'y' => $node['y']];
                $fullPath[] = ['lat' => $node['lat'], 'lng' => $node['lng']];
            }

            $steps[] = ['x' => $depot['x'], 'y' => $depot['y']];
            $fullPath[] = ['lat' => $depot['lat'], 'lng' => $depot['lng']];

            $routes[] = [
                'id'             => $i + 1,
                'vehicle_number' => $i + 1,
                'deliveries'     => $deliveries,
                'steps'          => $steps,
                'full_path'      => $fullPath,
                'cost'           => rand(150, 400),
                'color'          => $colors[$i % count($colors)],
            ];
        }

        return $routes;
    }

    private function getInstanceData(string $id): array
    {
        $baseLat = -15.793889;
        $baseLng = -47.882778;
        $scale = 0.0001;

        if ($id === 'RealWorldPostToy_5_2') {
            $rawNodes = [
                [5014, 3585],
                [5660, 3390],
                [6374, 2897],
                [3655, 3043],
                [5410, 2257],
                [4060, 2620],
            ];
            $name = 'RealWorldPostToy 5.2';
            $vehicles = 5;
            $matrix = array_fill(0, 6, array_fill(0, 6, 100));
        } else {
            $rawNodes = [
                [5014, 3585],
                [5714, 3417],
                [5737, 4500],
                [2281, 3534],
            ];
            $name = 'RealWorldPostToy 3.1';
            $vehicles = 5;
            $matrix = [
                [0.0, 652.9, 925.9, 2263.8],
                [652.9, 0.0, 1025.1, 2860.8],
                [925.9, 1025.1, 0.0, 2884.7],
                [2263.8, 2860.8, 2884.7, 0.0],
            ];
        }

        $formattedNodes = [];
        $depotRaw = $rawNodes[0];

        foreach ($rawNodes as $i => $n) {
            $dx = $n[0] - $depotRaw[0];
            $dy = $n[1] - $depotRaw[1];

            $formattedNodes[] = [
                'id'          => $i,
                'x'           => $dx,
                'y'           => $dy,
                'lat'         => $baseLat + ($dy * $scale),
                'lng'         => $baseLng + ($dx * $scale),
                'street_name' => $i === 0 ? 'Distribution Hub' : 'Delivery Point ' . $i,
                'road_type'   => $i === 0 ? 'Depot' : 'Customer',
            ];
        }

        return [
            'name'     => $name,
            'nodes'    => $formattedNodes,
            'matrix'   => $matrix,
            'vehicles' => $vehicles,
        ];
    }
}
