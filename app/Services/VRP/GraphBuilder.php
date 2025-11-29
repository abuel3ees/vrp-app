<?php

namespace App\Services\VRP;

class GraphBuilder
{
    public array $nodes = [];
    public array $edges = [];

    public function __construct(
        private float $pixelValue,
        private array $roadTypes,
        private array $penalties
    ) {
        $this->penaltyCalculator = new PenaltyCalculator($penalties, $roadTypes);
    }

    private function nodeId(array $p): string
    {
        return $p['x'] . '_' . $p['y'];
    }

    /**
     * Add a node if not exists.
     */
    private function addNode(array $p): string
    {
        $id = $this->nodeId($p);
        if (!isset($this->nodes[$id])) {
            $this->nodes[$id] = $p;
            $this->edges[$id] = [];
        }
        return $id;
    }

    /**
     * Add an edge between 2 nodes.
     */
    private function addEdge(
    string $from,
    string $to,
    float $distance,
    string $roadType,
    array $penaltyTags
): void
{
    $weightedCost = $this->penaltyCalculator->computeCost(
        $distance,
        $roadType,
        $penaltyTags
    );

    $this->edges[$from][] = [
        'to'           => $to,
        'baseCost'     => $distance,
        'weightedCost' => $weightedCost,
        'roadType'     => $roadType,
        'tags'         => $penaltyTags,
    ];
}

    /**
     * Build graph from all roads.
     */
    public function build(array $roads): array
    {
        foreach ($roads as $road) {
            $coords = $road['coordinates'];

            for ($i = 0; $i < count($coords) - 1; $i++) {
                $p1 = $coords[$i];
                $p2 = $coords[$i + 1];

                // Add nodes
                $n1 = $this->addNode($p1);
                $n2 = $this->addNode($p2);

                // Distance
                $dist = DistanceService::realDistance($p1, $p2, $this->pixelValue);

                // Add both directions
                $this->addEdge($n1, $n2, $dist, $road['type'], $road['penalties']);
                $this->addEdge($n2, $n1, $dist, $road['type'], $road['penalties']);
            }
        }

        return [
            'nodes' => $this->nodes,
            'edges' => $this->edges,
        ];
    }


}