<?php

namespace App\Http\Controllers;

use App\Services\VRP\JsonLoader;

class VRPController extends Controller
{
    public function map()
    {
        return inertia('VRP/Map', [
            'roads' => JsonLoader::loadRoadFiles(),
            'settings' => JsonLoader::loadSettings(),
            'penalties' => JsonLoader::loadPenalties(),
            'roadTypes' => JsonLoader::loadRoadTypes(),
        ]);
    }
}