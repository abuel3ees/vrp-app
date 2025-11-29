<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Instance;
use App\Models\VehicleRoute;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

// VRP services
use App\Services\VRP\JsonLoader;
use App\Services\VRP\VRPSolverService;
use App\Services\DeliveryGeneratorService;

class InstanceController extends Controller
{
    // --------------------------------------------
    // INDEX (List Instances)
    // --------------------------------------------
    public function index()
    {
        $instances = QueryBuilder::for(Instance::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('category'),
            ])
            ->allowedSorts(['id', 'name', 'category'])
            ->paginate(15)
            ->appends(request()->query());

        return Inertia::render('admin/Instance/Index', [
            'instances' => $instances,
            'filters'   => request()->only(['filter', 'sort']),
        ]);
    }

    // --------------------------------------------
    // SHOW INSTANCE DETAILS
    // --------------------------------------------
    public function show(Instance $instance)
    {
        return Inertia::render('admin/Instance/Show', [
            'instance' => $instance,
        ]);
    }

    // --------------------------------------------
    // RUN GENERATION VIA API (JSON RETURN)
    // --------------------------------------------
    public function run($id)
    {
        $instance = Instance::findOrFail($id);

        $generator = app(DeliveryGeneratorService::class);

        $deliveries = $generator->generateForInstance($instance);

        return response()->json([
            'instance' => $instance,
            'generated_count' => count($deliveries),
            'deliveries' => $deliveries,
        ]);
    }

    // --------------------------------------------
    // GENERATE DELIVERIES (UI ACTION)
    // --------------------------------------------
    public function generate(Instance $instance)
    {
        $generator = app(DeliveryGeneratorService::class);
        $generator->generateForInstance($instance);

        return back()->with('success', 'Deliveries generated!');
    }

    // --------------------------------------------
    // CREATE NEW INSTANCE
    // --------------------------------------------
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'               => 'required|string',
            'category'           => 'required|string',
            'delivery_points'    => 'required|integer|min:1',
            'number_of_vehicles' => 'required|integer|min:1',
        ]);

        $data['random_seed'] = rand(1, 999999);

        $instance = Instance::create($data);

        // Auto-create vehicles (optional)
        for ($i = 1; $i <= $instance->number_of_vehicles; $i++) {
            \App\Models\Vehicle::create([
                'instance_id' => $instance->id,
                'name'        => "Vehicle $i",
            ]);
        }

        return redirect()
            ->route('instances.show', $instance->id)
            ->with('success', 'Instance created with vehicles!');
    }

    // --------------------------------------------
    // SOLVE VRP FOR THIS INSTANCE (BACKEND)
    // --------------------------------------------
    public function solve(Instance $instance)
    {
        $solver = app(VRPSolverService::class);

        // Solve the VRP and return full vehicle route structures
        $routes = $solver->solve($instance);

        // Optional: store full solution JSON in instance
        $instance->solution = json_encode($routes);
        $instance->save();

        return redirect()
            ->route('instances.routes', $instance->id)
            ->with('success', 'Routes solved!');
    }

    // --------------------------------------------
    // VRP SOLUTION VIEWER PAGE (ANIMATED ROUTES)
    // --------------------------------------------
public function showRoutes($id)
{
    $instance = Instance::findOrFail($id);

    $routes = VehicleRoute::where('instance_id', $id)->get();
    $deliveries = \App\Models\Delivery::where('instance_id', $id)->get(['id','x','y']);

    return Inertia::render('admin/Instance/Routes', [
        'instance' => $instance,
        'routes'   => $routes,
        'nodes'    => $deliveries,   // ✔ PASS REAL NODES
    ]);
}

    // --------------------------------------------
    // ROAD NETWORK VIEWER PAGE (RAW ROAD GRAPH)
    // --------------------------------------------
    public function showRoadNetwork($id)
    {
        return Inertia::render('admin/Instance/RoadNetwork', [
            'instanceId' => $id,
            'roads'      => JsonLoader::loadRoadFiles(),
            'settings'   => JsonLoader::loadSettings(),
            'penalties'  => JsonLoader::loadPenalties(),
            'roadTypes'  => JsonLoader::loadRoadTypes(),
        ]);
    }
}