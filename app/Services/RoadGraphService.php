<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class RoadGraphService
{
    protected array $graph = [];
    protected bool $loaded = false;

    public function graph(): array
    {
        if (!$this->loaded) {
            $this->loadAllRoads();
            $this->loaded = true;
        }

        return $this->graph;
    }

    private function loadAllRoads(): void
{
    $path = storage_path('app/roads');
    $files = glob($path . '/*.json');

    foreach ($files as $file) {

        $json = json_decode(file_get_contents($file), true);

        if (!is_array($json)) {
            continue;
        }

        // ===== CASE 1: Top-level object with "nodes" =====
        if (isset($json['nodes']) && is_array($json['nodes'])) {
            foreach ($json['nodes'] as $node) {
                if (!isset($node['id'])) continue;
                $this->graph[$node['id']] = $node;
            }
        }

        // ===== CASE 2: Array of roads, each containing "nodes" =====
        if (isset($json[0]) && is_array($json[0])) {
            foreach ($json as $road) {
                if (isset($road['nodes']) && is_array($road['nodes'])) {
                    foreach ($road['nodes'] as $node) {
                        if (!isset($node['id'])) continue;
                        $this->graph[$node['id']] = $node;
                    }
                }
            }
        }

        // ===== CASE 3: Array of node objects directly =====
        // [ { "id": 1, ... }, { "id": 2, ... } ]
        if (isset($json[0]) && isset($json[0]['id'])) {
            foreach ($json as $node) {
                if (!isset($node['id'])) continue;
                $this->graph[$node['id']] = $node;
            }
        }
    }
}}