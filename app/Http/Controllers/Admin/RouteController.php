<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Route;
use App\Models\Vehicle;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class RouteController extends Controller
{
    public function index()
    {
        $routes = QueryBuilder::for(Route::class)
            ->allowedFilters([
                AllowedFilter::exact('vehicle_id'),
            ])
            ->allowedSorts(['id', 'total_distance', 'total_time'])
            ->with(['vehicle', 'deliveries'])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/routes/Index', [
            'routes' => $routes,
            'vehicles' => Vehicle::select('id','plate_number')->get(),
            'filters' => request()->all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/routes/Create', [
            'vehicles' => Vehicle::select('id','plate_number')->get(),
            'deliveries' => Delivery::where('status','!=','completed')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'deliveries' => 'required|array|min:1',
            'deliveries.*.id' => 'required|exists:deliveries,id',
            'deliveries.*.sequence' => 'required|integer',
        ]);

        $route = Route::create([
            'vehicle_id' => $data['vehicle_id'],
            'total_distance' => null,
            'total_time' => null,
        ]);

        $sync = [];
        foreach ($data['deliveries'] as $item) {
            $sync[$item['id']] = ['sequence' => $item['sequence']];
        }

        $route->deliveries()->sync($sync);

        return redirect()->route('routes.show', $route->id);
    }

    public function show(Route $route)
    {
        $route->load([
            'vehicle',
            'deliveries' => fn($q) => $q->orderBy('sequence'),
        ]);

        return Inertia::render('admin/routes/Show', [
            'route' => $route,
        ]);
    }

    public function edit(Route $route)
    {
        return Inertia::render('admin/routes/Edit', [
            'route' => $route->load(['vehicle','deliveries']),
            'vehicles' => Vehicle::select('id','plate_number')->get(),
            'allDeliveries' => Delivery::where('status','!=','completed')->get(),
        ]);
    }

    public function update(Request $request, Route $route)
    {
        $data = $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'deliveries' => 'required|array|min:1',
            'deliveries.*.id' => 'required|exists:deliveries,id',
            'deliveries.*.sequence' => 'required|integer',
        ]);

        $route->update([
            'vehicle_id' => $data['vehicle_id']
        ]);

        $sync = [];
        foreach ($data['deliveries'] as $item) {
            $sync[$item['id']] = ['sequence' => $item['sequence']];
        }

        $route->deliveries()->sync($sync);

        return redirect()->route('routes.show', $route->id);
    }

    public function destroy(Route $route)
    {
        $route->delete();

        return redirect()->route('routes.index');
    }
}