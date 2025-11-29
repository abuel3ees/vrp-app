<?php

namespace App\Services\VRP;

class DistanceService
{
    /**
     * Compute Euclidean pixel distance.
     */
    public static function pixelDistance($p1, $p2): float
    {
        $dx = $p2['x'] - $p1['x'];
        $dy = $p2['y'] - $p1['y'];
        return sqrt($dx * $dx + $dy * $dy);
    }

    /**
     * Convert pixel distance → real distance using PIXEL_VALUE.
     */
    public static function realDistance($p1, $p2, float $pixelValue): float
    {
        return self::pixelDistance($p1, $p2) * $pixelValue;
    }

    /**
     * More accurate cost later (after penalties).
     */
    public static function baseWeightedDistance($p1, $p2, float $pixelValue): float
    {
        return self::realDistance($p1, $p2, $pixelValue);
    }
}