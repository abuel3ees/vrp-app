<?php

namespace App\Http\Controllers\Admin;
use App\Models\Vehicle;
use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use App\Http\Controllers\Controller;
class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = QueryBuilder::for(Vehicle::class)
            ->allowedFilters([
                AllowedFilter::partial('plate_number'),
                AllowedFilter::partial('model'),
                AllowedFilter::exact('driver_id'),
            ])
            ->allowedSorts(['id', 'plate_number', 'capacity'])
            ->with('driver')
            ->paginate(10)
            ->appends(request()->query());

        return Inertia::render('admin/vehicles/Index', [
            'vehicles' => $vehicles,
            'filters' => request()->only(['filter', 'sort']),
            'drivers' => Driver::select('id','name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/vehicles/Create', [
            'drivers' => Driver::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'driver_id' => 'nullable|exists:drivers,id',
            'plate_number' => 'required|string|max:255',
            'capacity' => 'required|integer|min:0',
            'model' => 'nullable|string|max:255',
        ]);

        $vehicle = Vehicle::create($data);

        return redirect()
            ->route('vehicles.show', $vehicle->id)
            ->with('success', 'Vehicle created');
    }

    public function show(Vehicle $vehicle)
    {
        $vehicle->load('driver');

        return Inertia::render('admin/vehicles/Show', [
            'vehicle' => $vehicle,
        ]);
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('admin/vehicles/Edit', [
            'vehicle' => $vehicle->load('driver'),
            'drivers' => Driver::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $data = $request->validate([
            'driver_id' => 'nullable|exists:drivers,id',
            'plate_number' => 'required|string|max:255',
            'capacity' => 'required|integer|min:0',
            'model' => 'nullable|string|max:255',
        ]);

        $vehicle->update($data);

        return redirect()
            ->route('vehicles.show', $vehicle->id)
            ->with('success', 'Vehicle updated');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();

        return redirect()
            ->route('vehicles.index')
            ->with('success', 'Vehicle deleted');
    }
}