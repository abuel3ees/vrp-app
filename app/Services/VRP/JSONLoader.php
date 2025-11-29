<?php

namespace App\Services\VRP;

use Illuminate\Support\Facades\Storage;

class JsonLoader
{
    public static function loadRoadFiles(): array
    {
        $files = Storage::files('roads');
        $roads = [];

        foreach ($files as $file) {
            if (!str_ends_with($file, '.json')) continue;

            $content = json_decode(Storage::get($file), true);

            if (isset($content['roads'])) {
                foreach ($content['roads'] as $road) {
                    $roads[] = $road;
                }
            }
        }

        return $roads;
    }

    public static function loadSettings(): array
    {
        $path = 'roads/general_settings.json';

        if (Storage::exists($path)) {
            return json_decode(Storage::get($path), true)['general'];
        }

        return [];
    }

    public static function loadPenalties(): array
    {
        $path = 'roads/penalties.json';

        if (Storage::exists($path)) {
            return json_decode(Storage::get($path), true)['penalties'];
        }

        return [];
    }

    public static function loadRoadTypes(): array
    {
        $path = 'roads/road_types.json';

        if (Storage::exists($path)) {
            return json_decode(Storage::get($path), true)['roadTypes'];
        }

        return [];
    }
}