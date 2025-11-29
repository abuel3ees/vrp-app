<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class DataLibraryController extends Controller
{
    public function index()
    {
        // Helper to load JSON safely
        $loadJson = function ($file) {
            $path = storage_path("app/roads/{$file}");

            if (!file_exists($path)) return [];

            $json = json_decode(file_get_contents($path), true);
            return $json ?? [];
        };

        // Roads loader (all road files are { "roads": [] })
        $loadRoads = fn($file) => $loadJson($file)['roads'] ?? [];

        // Load core configs (these have wrapper keys)
        $generalFile   = $loadJson('general_settings.json');
        $penaltiesFile = $loadJson('penalties.json');
        $roadTypesFile = $loadJson('road_types.json');

        $general   = $generalFile['general']     ?? [];
        $penalties = $penaltiesFile['penalties'] ?? [];
        $roadTypes = $roadTypesFile['roadTypes'] ?? $roadTypesFile ?? [];

        // Road datasets
        $avenues     = $loadRoads('avenues.json');
        $streets     = $loadRoads('streets.json');
        $paths       = $loadRoads('paths.json');
        $highways    = $loadRoads('highways.json');
        $links       = $loadRoads('links.json');
        $municipal   = $loadRoads('municipal_roads.json');
        $plazas      = $loadRoads('plazas.json');
        $roundabouts = $loadRoads('roundabouts.json');

        // Counts
        $counts = [
            'avenues'     => count($avenues),
            'streets'     => count($streets),
            'paths'       => count($paths),
            'highways'    => count($highways),
            'links'       => count($links),
            'municipal'   => count($municipal),
            'plazas'      => count($plazas),
            'roundabouts' => count($roundabouts),
        ];

        return Inertia::render('admin/DataLibrary/Index', [
            'general'   => $general,
            'penalties' => $penalties,
            'roadTypes' => $roadTypes,
            'counts'    => $counts,
        ]);
    }
}