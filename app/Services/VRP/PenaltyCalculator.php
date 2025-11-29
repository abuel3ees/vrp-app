<?php

namespace App\Services\VRP;

class PenaltyCalculator
{
    private array $zones;
    private array $categories;
    private array $roadTypes;

    public function __construct(array $penalties, array $roadTypes)
    {
        $this->zones = $penalties['zones'] ?? [];
        $this->categories = $penalties['categories'] ?? [];
        $this->roadTypes = $roadTypes;
    }

    /**
     * Compute the final weight for an edge.
     */
    public function computeCost(float $baseCost, string $roadType, array $tags): float
    {
        $zoneMultiplier = 1.0;
        $categoryMultiplier = 1.0;

        // ------------------------------------------
        // Zone penalties
        // ------------------------------------------
        foreach ($tags as $tag) {
            if (isset($this->zones[$tag])) {
                $zoneMultiplier = $this->zones[$tag];
                break; // Only one zone applies
            }
        }

        // ------------------------------------------
        // Category penalties
        // ------------------------------------------
        foreach ($tags as $tag) {
            if (isset($this->categories[$tag])) {
                $categoryMultiplier = $this->categories[$tag];
                break;
            }
        }

        // ------------------------------------------
        // Road type penalties
        // ------------------------------------------
        $roadTypeValue = 1.0;
        $roadTypeCross = 0;

        if (isset($this->roadTypes[$roadType])) {
            $roadTypeValue = $this->roadTypes[$roadType]['value'];
            $roadTypeCross = $this->roadTypes[$roadType]['crossCost'];
        }

        // ------------------------------------------
        // Final weighted cost
        // ------------------------------------------
        return $baseCost * $zoneMultiplier * $categoryMultiplier * $roadTypeValue
             + $roadTypeCross;
    }
}