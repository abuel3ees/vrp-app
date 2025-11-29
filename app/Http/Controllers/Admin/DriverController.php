<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = QueryBuilder::for(Driver::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::partial('phone'),
                AllowedFilter::partial('email'),
            ])
            ->allowedSorts(['id', 'name', 'email'])
            ->paginate(10)
            ->appends(request()->query());

        return Inertia::render('admin/drivers/Index', [
            'drivers' => $drivers,
            'filters' => request()->only(['filter', 'sort']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/drivers/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email',
        ]);

        $driver = Driver::create($data);

        return redirect()
            ->route('drivers.show', $driver->id)
            ->with('success', 'Driver created successfully.');
    }

    public function show(Driver $driver)
    {
        return Inertia::render('admin/drivers/Show', [
            'driver' => $driver,
        ]);
    }

    public function edit(Driver $driver)
    {
        return Inertia::render('admin/drivers/Edit', [
            'driver' => $driver,
        ]);
    }

    public function update(Request $request, Driver $driver)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email',
        ]);

        $driver->update($data);

        return redirect()
            ->route('drivers.show', $driver->id)
            ->with('success', 'Driver updated successfully.');
    }

    public function destroy(Driver $driver)
    {
        $driver->delete();

        return redirect()
            ->route('drivers.index')
            ->with('success', 'Driver deleted.');
    }
}