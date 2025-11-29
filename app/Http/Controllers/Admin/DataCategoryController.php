<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
class DataCategoryController extends Controller
{
    public function show($category)
    {
        $path = storage_path("app/roads/{$category}.json");

        if (!file_exists($path)) {
            abort(404, "Dataset not found.");
        }

        $json = json_decode(file_get_contents($path), true) ?? [];
        $roads = $json['roads'] ?? [];

        return Inertia::render("admin/DataLibrary/CategoryIndex", [
            "category" => $category,
            "roads" => $roads,
        ]);
    }

    public function detail($category, $index)
{
    $path = storage_path("app/roads/{$category}.json");

    if (!file_exists($path)) {
        abort(404, "Dataset not found: {$category}");
    }

    $json = json_decode(file_get_contents($path), true);
    $roads = $json['roads'] ?? [];

    if (!isset($roads[$index])) {
        abort(404, "Road not found.");
    }

    $road = $roads[$index];

    return Inertia::render("admin/DataLibrary/RoadDetail", [
        'category' => $category,
        'index'    => $index,
        'road'     => $road,
    ]);
}
}
