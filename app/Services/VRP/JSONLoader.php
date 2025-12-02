<?php

namespace App\Services\VRP;

use Illuminate\Support\Facades\Storage;

class JsonLoader
{
    public static function loadRoadFiles(string $profile = 'brazil'): array
    {
        $basePath = "roads/{$profile}";
        if (!Storage::exists($basePath)) {
            // Fallback if folder missing
            $basePath = 'roads/brazil';
        }

        $files = Storage::files($basePath);
        $roads = [];

        foreach ($files as $file) {
            if (!str_ends_with($file, '.json')) {
                continue;
            }

            $content = json_decode(Storage::get($file), true);

            if (isset($content['roads']) && is_array($content['roads'])) {
                foreach ($content['roads'] as $road) {
                    $roads[] = $road;
                }
            }
        }

        return $roads;
    }

    public static function loadSettings(string $profile = 'brazil'): array
    {
        $path = "roads/{$profile}/general_settings.json";

        if (!Storage::exists($path)) {
            $path = 'roads/brazil/general_settings.json';
        }

        $data = json_decode(Storage::get($path), true);

        return $data['general'] ?? [];
    }

    public static function loadPenalties(string $profile = 'brazil'): array
    {
        $path = "roads/{$profile}/penalties.json";

        if (!Storage::exists($path)) {
            $path = 'roads/brazil/penalties.json';
        }

        $data = json_decode(Storage::get($path), true);

        return $data['penalties'] ?? [];
    }

    public static function loadRoadTypes(string $profile = 'brazil'): array
    {
        $path = "roads/{$profile}/road_types.json";

        if (!Storage::exists($path)) {
            $path = 'roads/brazil/road_types.json';
        }

        $data = json_decode(Storage::get($path), true);

        return $data['roadTypes'] ?? [];
    }
}