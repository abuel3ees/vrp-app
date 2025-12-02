<?php

namespace App\Services\VRP;

class GraphBuilder
{
    public array $nodes = [];
    public array $edges = [];

    private PenaltyCalculator $penaltyCalculator;

    public function __construct(
        private float $pixelValue,
        private array $roadTypes,
        private array $penalties
    ) {
        $this->penaltyCalculator = new PenaltyCalculator(
            $this->penalties,
            $this->roadTypes
        );
    }

    private function nodeId(array $p): string
    {
        // 🔥 CRITICAL FIX: Use 6 decimal places (micrometer precision)
        // Previous versions rounded too aggressively for Lat/Lng
        return sprintf('%.6f_%.6f', $p['x'], $p['y']);
    }

    private function normalizePoint($raw): ?array
    {
        if (is_array($raw) && isset($raw[0]) && isset($raw[1])) {
            return ['x' => (float)$raw[0], 'y' => (float)$raw[1]];
        }
        if (isset($raw['x']) || isset($raw['y'])) {
            return ['x' => (float)($raw['x'] ?? 0), 'y' => (float)($raw['y'] ?? 0)];
        }
        if (isset($raw['lng']) || isset($raw['lon']) || isset($raw['lat'])) {
            $x = $raw['lng'] ?? $raw['lon'] ?? 0;
            $y = $raw['lat'] ?? 0;
            return ['x' => (float)$x, 'y' => (float)$y];
        }
        return null;
    }

    private function addNode(array $p): string
    {
        $id = $this->nodeId($p);
        if (!isset($this->nodes[$id])) {
            $this->nodes[$id] = $p;
            $this->edges[$id] = [];
        }
        return $id;
    }

    private function addEdge(string $from, string $to, float $distance, string $roadType, array $penaltyTags): void
    {
        // Safety check for 0 distance
        if ($distance <= 0.0001) return;

        $weightedCost = $this->penaltyCalculator->computeCost($distance, $roadType, $penaltyTags);

        $this->edges[$from][] = [
            'to'           => $to,
            'baseCost'     => $distance,
            'weightedCost' => $weightedCost,
            'roadType'     => $roadType,
            'tags'         => $penaltyTags,
        ];
    }

    public function build(array $roads): array
    {
        $this->nodes = [];
        $this->edges = [];
        
        // Detect if we are in Lat/Lng mode based on the first coordinate we see
        // If x < 180, we assume Lat/Lng and FORCE pixel value to 1.0 (Meters)
        $detectedGeo = false;

        foreach ($roads as $road) {
            if (empty($road['coordinates']) || !is_array($road['coordinates'])) continue;

            $cleanPoints = [];
            foreach ($road['coordinates'] as $rawPoint) {
                $p = $this->normalizePoint($rawPoint);
                if ($p) $cleanPoints[] = $p;
            }

            if (count($cleanPoints) < 2) continue;

            // Auto-detect Geo Mode on first valid road
            if (!$detectedGeo && abs($cleanPoints[0]['x']) <= 180) {
                $detectedGeo = true;
                // Override pixel value to 1 because Haversine returns pure meters
                $this->pixelValue = 1.0; 
            }

            $roadType    = $road['type'] ?? 'UNKNOWN';
            $penaltyTags = $road['penalties'] ?? [];

            for ($i = 0; $i < count($cleanPoints) - 1; $i++) {
                $p1 = $cleanPoints[$i];
                $p2 = $cleanPoints[$i + 1];

                $n1 = $this->addNode($p1);
                $n2 = $this->addNode($p2);

                if ($n1 === $n2) continue; 

                // Calculate distance
                $dist = DistanceService::realDistance($p1, $p2, $this->pixelValue);

                $this->addEdge($n1, $n2, $dist, $roadType, $penaltyTags);
                $this->addEdge($n2, $n1, $dist, $roadType, $penaltyTags);
            }
        }

        return [
            'nodes' => $this->nodes,
            'edges' => $this->edges,
        ];
    }
}