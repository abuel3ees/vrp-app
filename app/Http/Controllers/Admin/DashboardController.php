<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Models\Driver;
use App\Models\Vehicle;
use App\Models\Delivery;
use App\Models\Route;

class DashboardController extends Controller
{
    public function index()
    {
        // ---------------------------------------------------
        // 1. Load Depot from general_settings.json
        // ---------------------------------------------------
        $general = $this->loadJson("general_settings.json")['general'] ?? null;

        $DEPOT_X = $general["DEPOT_X"] ?? 0;
        $DEPOT_Y = $general["DEPOT_Y"] ?? 0;

        // ---------------------------------------------------
        // 2. Count roads by category
        // ---------------------------------------------------
        $roadCounts = [
            "avenues"     => $this->countRoads("avenues.json"),
            "streets"     => $this->countRoads("streets.json"),
            "paths"       => $this->countRoads("paths.json"),
            "highways"    => $this->countRoads("highways.json"),
            "links"       => $this->countRoads("links.json"),
            "municipal"   => $this->countRoads("municipal_roads.json"),
            "plazas"      => $this->countRoads("plazas.json"),
            "roundabouts" => $this->countRoads("roundabouts.json"),
        ];

        $totalRoads = array_sum($roadCounts);

        // ---------------------------------------------------
        // 3. Basic system stats
        // ---------------------------------------------------
        $driversCount = Driver::count();
        $vehiclesCount = Vehicle::count();
        $deliveriesCount = Delivery::count();

        // ---------------------------------------------------
        // 4. Deliveries over time (grouped by day)
        // ---------------------------------------------------
        $deliveriesDaily = Delivery::selectRaw("DATE(created_at) as day, COUNT(*) as total")
            ->groupBy("day")
            ->orderBy("day")
            ->get();

        $deliveriesCompletedDaily = Delivery::where("status", "completed")
            ->selectRaw("DATE(updated_at) as day, COUNT(*) as total")
            ->groupBy("day")
            ->orderBy("day")
            ->get();

        // ---------------------------------------------------
        // 5. Failed deliveries = pending > 24 hours
        // ---------------------------------------------------
        $deliveriesFailedDaily = Delivery::where("status", "pending")
            ->where("created_at", "<", now()->subHours(24))
            ->selectRaw("DATE(created_at) as day, COUNT(*) as total")
            ->groupBy("day")
            ->orderBy("day")
            ->get();

        // ---------------------------------------------------
        // 6. Routes distance/time over time
        // ---------------------------------------------------
        $routesDaily = Route::selectRaw("DATE(created_at) as day, COUNT(*) as total")
            ->groupBy("day")
            ->orderBy("day")
            ->get();

        $routesDistanceDaily = Route::selectRaw("DATE(created_at) as day, SUM(total_distance) as total")
            ->groupBy("day")
            ->orderBy("day")
            ->get();

        $routesTimeDaily = Route::selectRaw("DATE(created_at) as day, SUM(total_time) as total")
            ->groupBy("day")
            ->orderBy("day")
            ->get();

        // ---------------------------------------------------
        // 7. Driver activity (drivers with deliveries last 14 days)
        // ---------------------------------------------------
        $activeDriversDaily = Delivery::where("deliveries.created_at", ">", now()->subDays(14))
            ->join("vehicles", "deliveries.vehicle_id", "=", "vehicles.id")
            ->selectRaw("DATE(deliveries.created_at) as day, COUNT(DISTINCT vehicles.driver_id) as activeDrivers")
            ->groupBy("day")
            ->orderBy("day")
            ->get();

        // ---------------------------------------------------
        // 8. Vehicle activity (vehicles used last 14 days)
        // ---------------------------------------------------
        $activeVehiclesDaily = Delivery::where("created_at", ">", now()->subDays(14))
            ->whereNotNull("vehicle_id")
            ->selectRaw("DATE(created_at) as day, COUNT(DISTINCT vehicle_id) as activeVehicles")
            ->groupBy("day")
            ->orderBy("day")
            ->get();

        // ---------------------------------------------------
        // 9. Delivery status breakdown (pie)
        // ---------------------------------------------------
        $statusDistribution = Delivery::selectRaw("status, COUNT(*) as total")
            ->groupBy("status")
            ->get();

        // ---------------------------------------------------
        // 10. Penalty zones & categories
        // ---------------------------------------------------
        $penalties = $this->loadJson("penalties.json")['penalties'] ?? [
            "zones" => [],
            "categories" => []
        ];

        // ---------------------------------------------------
        // 11. Road type distribution
        // ---------------------------------------------------
        $roadTypes = $this->loadJson("road_types.json")['road_types'] ?? [];

        // ---------------------------------------------------
        // 12. Recent deliveries
        // ---------------------------------------------------
        $recentDeliveries = Delivery::latest()->limit(10)->get();

        // ---------------------------------------------------
        // SEND DATA TO INERTIA
        // ---------------------------------------------------
        return Inertia::render("dashboard", [
            "roadCounts" => $roadCounts,
            "totalRoads" => $totalRoads,

            "driversCount" => $driversCount,
            "vehiclesCount" => $vehiclesCount,
            "deliveriesCount" => $deliveriesCount,

            "deliveriesDaily" => $deliveriesDaily,
            "deliveriesCompletedDaily" => $deliveriesCompletedDaily,
            "deliveriesFailedDaily" => $deliveriesFailedDaily,

            "routesDaily" => $routesDaily,
            "routesDistanceDaily" => $routesDistanceDaily,
            "routesTimeDaily" => $routesTimeDaily,

            "activeDriversDaily" => $activeDriversDaily,
            "activeVehiclesDaily" => $activeVehiclesDaily,

            "statusDistribution" => $statusDistribution,

            "penalties" => $penalties,
            "roadTypes" => $roadTypes,

            "recentDeliveries" => $recentDeliveries,
        ]);
    }

    // -------------------------------------------------------
    // Helper — Load JSON safely
    // -------------------------------------------------------
    private function loadJson($file)
    {
        $path = storage_path("app/roads/" . $file);
        if (!file_exists($path)) {
            return [];
        }
        return json_decode(file_get_contents($path), true);
    }

    // -------------------------------------------------------
    // Helper — Count roads in a file
    // -------------------------------------------------------
    private function countRoads($file)
    {
        $data = $this->loadJson($file);
        return isset($data["roads"]) ? count($data["roads"]) : 0;
    }
}