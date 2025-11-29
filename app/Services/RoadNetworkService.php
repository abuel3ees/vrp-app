<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class RoadNetworkService
{
    protected array $nodes = [];
    protected array $graph = [];

 public function __construct()
{
    $files = Storage::files('roads');

    foreach ($files as $file) {
        if (!str_ends_with($file, '.json')) continue;

        $json = json_decode(Storage::get($file), true);
        if (!is_array($json)) continue;

        // ======================
        // CASE 1 — { "roads": [...] }
        // ======================
        if (isset($json['roads']) && is_array($json['roads'])) {
            $this->loadRoadList($json['roads']);
            continue;
        }

        // ======================
        // CASE 2 — Any named collection: { "avenues": [...] }, { "paths": [...] }
        // ======================
        foreach ($json as $key => $value) {
            if (is_array($value) && isset($value[0]) && isset($value[0]['coordinates'])) {
                $this->loadRoadList($value);
                continue 2;
            }
        }

        // ======================
        // CASE 3 — Raw array of roads: [ { "coordinates": [...] } ]
        // ======================
        if (isset($json[0]) && isset($json[0]['coordinates'])) {
            $this->loadRoadList($json);
            continue;
        }
    }
}

public function nearestNode($lng, $lat)
{
    $nodes = $this->nodes(); // load all nodes with x,y coords

    $best = null;
    $bestDist = INF;

    foreach ($nodes as $node) {
        $dx = $node['x'] - $lng;
        $dy = $node['y'] - $lat;
        $dist = $dx*$dx + $dy*$dy;

        if ($dist < $bestDist) {
            $bestDist = $dist;
            $best = $node;
        }
    }

    return $best;
}

public function allGridNodes()
{
    $files = [
        'avenues.json',
        'streets.json',
        'paths.json',
        'links.json',
        'highways.json',
        'municipal_roads.json',
        'plazas.json',
        'roundabouts.json',
    ];

    $nodes = [];

    foreach ($files as $file) {
        $path = storage_path("app/roads/$file");

        if (!file_exists($path)) continue;

        $data = json_decode(file_get_contents($path), true);

        foreach ($data as $road) {
            foreach ($road['coordinates'] as $c) {
                $nodes[] = [
                    'x' => $c['x'],
                    'y' => $c['y'],
                ];
            }
        }
    }

    return $nodes;
}

public function getNode(string $id)
{
    return $this->nodes[$id] ?? null;
}

private function interpolate($x1, $y1, $x2, $y2, $steps = 20)
{
    $frames = [];

    for ($i = 0; $i <= $steps; $i++) {
        $t = $i / $steps;

        $frames[] = [
            'x' => $x1 + ($x2 - $x1) * $t,
            'y' => $y1 + ($y2 - $y1) * $t
        ];
    }

    return $frames;
}

public function findNearestGraphNode($x, $y)
{
    $best = null;
    $bestDist = INF;

    foreach ($this->nodes as $id => $node) {
        if (!isset($node['x'], $node['y'])) continue;

        $dx = $x - $node['x'];
        $dy = $y - $node['y'];
        $dist = $dx * $dx + $dy * $dy;

        if ($dist < $bestDist) {
            $bestDist = $dist;
            $best = [
                'id' => $id,
                'x'  => $node['x'],
                'y'  => $node['y']
            ];
        }
    }

    return $best;
}
public function closestGridNode($lat, $lng)
{
    $nodes = $this->allGridNodes();

    $closest = null;
    $best = INF;

    foreach ($nodes as $n) {
        // compare with delivery's approximate real coordinates if any
        // since you don't have real geo coordinates, we treat lat/lng as 0 for now
        // or use (0,0) meaning all nodes are candidates
        $d = hypot($n['x'], $n['y']);  

        if ($d < $best) {
            $best = $d;
            $closest = $n;
        }
    }

    return $closest; // returns ['x' => ..., 'y' => ...]
}
private function loadRoadList(array $roads)
{
    foreach ($roads as $road) {
        if (!isset($road['coordinates']) || !is_array($road['coordinates'])) continue;

        $coords = $road['coordinates'];

        for ($i = 0; $i < count($coords) - 1; $i++) {

            $a = $coords[$i];
            $b = $coords[$i + 1];

            $ida = "{$a['x']}_{$a['y']}";
            $idb = "{$b['x']}_{$b['y']}";

            // Save nodes
            $this->nodes[$ida] = $a;
            $this->nodes[$idb] = $b;

            // Euclidean distance
            $dist = hypot($a['x'] - $b['x'], $a['y'] - $b['y']);

            // Undirected adjacency
            $this->graph[$ida][$idb] = $dist;
            $this->graph[$idb][$ida] = $dist;
        }
    }
}

    public function allNodes()
{
    $nodes = [];

    foreach ($this->nodes as $n) {
        if (isset($n['x']) && isset($n['y'])) {
            $nodes[] = ['x' => $n['x'], 'y' => $n['y']];
        }
    }

    return $nodes;
}

    public function graph()
    {
        return $this->graph;
    }
}