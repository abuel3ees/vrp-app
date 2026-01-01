<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\VehicleController;
use App\Http\Controllers\Admin\DeliveryController;
use App\Http\Controllers\Admin\RouteController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DataLibraryController;
use App\Http\Controllers\Admin\DataCategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InstanceController;
use App\Http\Controllers\Admin\OptimizeController; // <--- Imported New Controller

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/
Route::get('/presentation', function () {
    return Inertia::render('Presentation');
})->name('presentation');


Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

Route::get('/learn', function () {
    return inertia('Learn');
})->name('learn');

Route::get('/debug-roads', function () {
    $service = app(\App\Services\RoadNetworkService::class);
    $nodes = $service->allNodes();

    return dd([
        'total_nodes' => count($nodes),
        'first_5' => array_slice($nodes, 0, 5),
    ]);
});

Route::middleware(['auth'])->prefix('admin')->group(function () {
    
    // --- DEBUGGING ---
    Route::get('/debug-graph', function () {
        // 1. Force load the Amman profile
        $profile = 'amman';
        $roads = \App\Services\VRP\JsonLoader::loadRoadFiles($profile);
        
        // 2. Build the graph
        $builder = new \App\Services\VRP\GraphBuilder(1.0, [], []);
        $graph = $builder->build($roads);
        
        // 3. Dump the first 5 nodes and edges
        $sampleNodes = array_slice($graph['nodes'], 0, 5);
        $sampleEdgeKey = array_key_first($graph['edges']);
        $sampleEdges = $graph['edges'][$sampleEdgeKey] ?? [];

        dd([
            'total_nodes' => count($graph['nodes']),
            'total_edges' => count($graph['edges']),
            'sample_nodes' => $sampleNodes,
            'sample_edges_from_first_node' => $sampleEdges,
            'distance_test' => 'If sample_edges cost is 0, your coordinates are merging.',
        ]);
    });

    // --- DASHBOARD ---
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('admin.dashboard');

    // --- OPTIMIZER (New) ---
    Route::get('/optimize', [OptimizeController::class, 'index'])
        ->name('admin.optimize');
    Route::post('/optimize/run', [OptimizeController::class, 'run'])
        ->name('admin.optimize.run');

    // --- RESOURCES ---
    Route::resource('users', UserController::class);
    Route::resource('drivers', DriverController::class);
    Route::resource('vehicles', VehicleController::class);
    Route::resource('deliveries', DeliveryController::class);
    Route::resource('routes', RouteController::class);

    // --- DATA LIBRARY ---
    Route::get('/data-library', [DataLibraryController::class, 'index'])
        ->name('data.index');
    Route::get('/data-library/{category}', [DataCategoryController::class, 'show'])
        ->name('data.category');
    Route::get('/data-library/{category}/{index}', [DataCategoryController::class, 'detail'])
        ->name('data.category.detail');

    // --- INSTANCES ---
    Route::resource('instances', InstanceController::class);
    
    Route::get('/instances/{id}/run', [InstanceController::class, 'run'])
        ->name('instances.run');
    
    Route::get('/instances/{instance}/generate', [InstanceController::class, 'generate'])
        ->name('instances.generate');
    
    Route::get('/instances/{instance}/solve', [InstanceController::class, 'solve'])
        ->name('instances.solve');
    
    Route::get('/instances/{id}/routes', [InstanceController::class, 'showRoutes'])
        ->name('instances.routes');
    
    Route::get('/instances/{id}/road-network', [InstanceController::class, 'showRoadNetwork'])
        ->name('instances.road-network');
});

require __DIR__.'/settings.php';