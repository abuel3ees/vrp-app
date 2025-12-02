<?php

namespace App\Services\VRP;

class DistanceService
{
    public static function pixelDistance($p1, $p2): float
    {
        // Heuristic: If coordinates are within Lat/Lng ranges, use Haversine (Earth curve)
        $isGeographic = (
            abs($p1['x']) <= 180 && abs($p1['y']) <= 90 &&
            abs($p2['x']) <= 180 && abs($p2['y']) <= 90
        );

        if ($isGeographic) {
            return self::haversine($p1, $p2);
        }

        // Cartesian (Euclidean)
        $dx = $p2['x'] - $p1['x'];
        $dy = $p2['y'] - $p1['y'];
        return sqrt($dx * $dx + $dy * $dy);
    }

    public static function realDistance($p1, $p2, float $pixelValue): float
    {
        $dist = self::pixelDistance($p1, $p2);
        return $dist * $pixelValue;
    }

    private static function haversine($p1, $p2): float
    {
        $earthRadius = 6371000; // Meters

        $lat1 = deg2rad($p1['y']);
        $lon1 = deg2rad($p1['x']);
        $lat2 = deg2rad($p2['y']);
        $lon2 = deg2rad($p2['x']);

        $dLat = $lat2 - $lat1;
        $dLon = $lon2 - $lon1;

        $a = sin($dLat / 2) ** 2 +
             cos($lat1) * cos($lat2) *
             sin($dLon / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}