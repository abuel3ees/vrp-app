<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Instance;
use App\Models\VehicleRoute;
use App\Models\Vehicle;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

// VRP Services
use App\Services\VRP\JsonLoader;
use App\Services\VRP\VRPSolverService;
use App\Services\DeliveryGeneratorService;

class InstanceController extends Controller
{
    /**
     * Helper to decide which map profile to use.
     */
    private function resolveProfile(Instance $instance): string
    {
        $category = strtolower($instance->category ?? '');

        if (str_starts_with($category, 'amman')) {
            return 'amman';
        }

        return 'brazil';
    }
    
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
            ->defaultSort('-created_at') // Standard Spatie sort for "Newest first"
            ->allowedSorts(['id', 'name', 'category', 'created_at'])
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
    // CREATE NEW INSTANCE
    // --------------------------------------------
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'               => 'required|string|max:255',
            'category'           => 'required|string|max:255',
            'delivery_points'    => 'required|integer|min:1|max:10000',
            'number_of_vehicles' => 'required|integer|min:1|max:100',
        ]);

        $data['random_seed'] = rand(1, 999999);

        $instance = Instance::create($data);

        // Auto-create vehicle placeholders
        $vehicles = [];
        $now = now();
        for ($i = 1; $i <= $instance->number_of_vehicles; $i++) {
            $vehicles[] = [
                'instance_id' => $instance->id,
                'name'        => "Vehicle $i",
                'created_at'  => $now,
                'updated_at'  => $now,
            ];
        }
        Vehicle::insert($vehicles);

        return redirect()
            ->route('instances.show', $instance->id)
            ->with('success', 'Instance created successfully!');
    }

    // --------------------------------------------
    // GENERATE DELIVERIES (UI ACTION)
    // --------------------------------------------
    public function generate(Instance $instance)
    {
        try {
            $generator = app(DeliveryGeneratorService::class);
            $count = count($generator->generateForInstance($instance));

            return back()->with('success', "Success! {$count} deliveries generated.");
        } catch (\Exception $e) {
            return back()->with('error', 'Generation Failed: ' . $e->getMessage());
        }
    }

    // --------------------------------------------
    // SOLVE VRP FOR THIS INSTANCE (BACKEND)
    // --------------------------------------------
    public function solve(Instance $instance)
    {
        // Increase time limit for large calculations
        set_time_limit(600);

        try {
            $profile = $this->resolveProfile($instance);
            
            $solver = app(VRPSolverService::class);
            $routes = $solver->solve($instance, $profile);

            // Optional: Store summary in JSON
            $instance->solution = json_encode($routes);
            $instance->save();

            return redirect()
                ->route('instances.routes', $instance->id)
                ->with('success', 'VRP Solved! Routes generated successfully.');

        } catch (\Exception $e) {
            // Log the error for debugging
            \Illuminate\Support\Facades\Log::error("VRP Solve Error: " . $e->getMessage());
            
            return back()->with('error', 'Solver Error: ' . $e->getMessage());
        }
    }

    // --------------------------------------------
    // VRP SOLUTION VIEWER PAGE (ANIMATED ROUTES)
    // --------------------------------------------
    public function showRoutes($id)
    {
        $instance = Instance::findOrFail($id);

        // Eager load for performance if needed, though usually not needed here
        $routes = VehicleRoute::where('instance_id', $id)
            ->orderBy('vehicle_number')
            ->get();
            
        $deliveries = Delivery::where('instance_id', $id)
            ->get(['id', 'x', 'y', 'customer_name', 'address']);

        return Inertia::render('admin/Instance/Routes', [
            'instance' => $instance,
            'routes'   => $routes,
            'nodes'    => $deliveries,
        ]);
    }

    // --------------------------------------------
    // ROAD NETWORK VIEWER PAGE (RAW ROAD GRAPH)
    // --------------------------------------------
    public function showRoadNetwork($id)
    {
        $instance = Instance::findOrFail($id);
        $profile  = $this->resolveProfile($instance);

        return Inertia::render('admin/Instance/RoadNetwork', [
            'instance' => $instance,
            'profile'  => $profile,
            'roads'    => JsonLoader::loadRoadFiles($profile),
            'settings' => JsonLoader::loadSettings($profile),
            'penalties'=> JsonLoader::loadPenalties($profile),
            'roadTypes'=> JsonLoader::loadRoadTypes($profile),
        ]);
    }

    // --------------------------------------------
    // API: RUN GENERATION (JSON RETURN)
    // --------------------------------------------
    public function run($id)
    {
        try {
            $instance = Instance::findOrFail($id);
            $generator = app(DeliveryGeneratorService::class);
            $deliveries = $generator->generateForInstance($instance);

            return response()->json([
                'success' => true,
                'instance' => $instance,
                'generated_count' => count($deliveries),
                'deliveries' => $deliveries,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Instance $instance)
    {
        $instance->delete();

        return redirect()
            ->route('instances.index')
            ->with('success', 'Instance deleted!');
    }
}