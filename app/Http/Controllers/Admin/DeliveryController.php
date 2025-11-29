<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class DeliveryController extends Controller
{
    private const BASE_LAT = -15.78;
    private const BASE_LNG = -47.93;
    private const SCALE    = 0.00005;

    /**
     * Convert lat/lng → x/y (reverse projection)
     */
    private function reverseProject(float $lat, float $lng): array
    {
        return [
            'x' => ($lng - self::BASE_LNG) / self::SCALE,
            'y' => ($lat - self::BASE_LAT) / self::SCALE,
        ];
    }

    // ----------------------------------------------------
    // INDEX
    // ----------------------------------------------------
    public function index()
    {
        $deliveries = QueryBuilder::for(Delivery::class)
            ->allowedFilters([
                AllowedFilter::partial('customer_name'),
                AllowedFilter::partial('address'),
                AllowedFilter::exact('status'),
            ])
            ->allowedSorts(['id', 'deadline', 'status'])
            ->paginate(10)
            ->appends(request()->query());

        return Inertia::render('admin/deliveries/Index', [
            'deliveries' => $deliveries,
            'filters'    => request()->only(['filter', 'sort']),
        ]);
    }

    // ----------------------------------------------------
    // CREATE
    // ----------------------------------------------------
    public function create()
    {
        return Inertia::render('admin/deliveries/Create');
    }

    // ----------------------------------------------------
    // STORE
    // ----------------------------------------------------
    public function store(Request $request)
    {
        $manual = !$request->has('auto_generated');

        $data = $request->validate([
            'instance_id'   => 'nullable|exists:instances,id',
            'customer_name' => $manual ? 'required|string|max:255' : 'nullable|string|max:255',
            'address'       => $manual ? 'required|string|max:255' : 'nullable|string|max:255',
            'lat'           => 'required|numeric',
            'lng'           => 'required|numeric',
            'deadline'      => 'nullable|date',
            'status'        => 'required|in:pending,assigned,completed',
            'x'             => 'nullable|integer',
            'y'             => 'nullable|integer',
        ]);

        // Auto-calc x/y if missing
        if (!$request->filled('x') || !$request->filled('y')) {
            $pixel = $this->reverseProject($data['lat'], $data['lng']);
            $data['x'] = round($pixel['x']);
            $data['y'] = round($pixel['y']);
        }

        $delivery = Delivery::create($data);

        return redirect()
            ->route('deliveries.show', $delivery->id)
            ->with('success', 'Delivery created');
    }

    // ----------------------------------------------------
    // SHOW
    // ----------------------------------------------------
    public function show(Delivery $delivery)
    {
        return Inertia::render('admin/deliveries/Show', [
            'delivery' => $delivery,
        ]);
    }

    // ----------------------------------------------------
    // EDIT
    // ----------------------------------------------------
    public function edit(Delivery $delivery)
    {
        return Inertia::render('admin/deliveries/Edit', [
            'delivery' => $delivery,
        ]);
    }

    // ----------------------------------------------------
    // UPDATE
    // ----------------------------------------------------
    public function update(Request $request, Delivery $delivery)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:255',
            'address'       => 'required|string|max:255',
            'lat'           => 'required|numeric',
            'lng'           => 'required|numeric',
            'deadline'      => 'nullable|date',
            'status'        => 'required|in:pending,assigned,completed',
            'x'             => 'nullable|integer',
            'y'             => 'nullable|integer',
        ]);

        // Auto-calc x/y if missing
        if (!$request->filled('x') || !$request->filled('y')) {
            $pixel = $this->reverseProject($data['lat'], $data['lng']);
            $data['x'] = round($pixel['x']);
            $data['y'] = round($pixel['y']);
        }

        $delivery->update($data);

        return redirect()
            ->route('deliveries.show', $delivery->id)
            ->with('success', 'Delivery updated');
    }

    // ----------------------------------------------------
    // DESTROY
    // ----------------------------------------------------
    public function destroy(Delivery $delivery)
    {
        $delivery->delete();

        return redirect()
            ->route('deliveries.index')
            ->with('success', 'Delivery deleted');
    }
}