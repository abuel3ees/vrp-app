<?php

namespace App\Services\VRP;

use App\Models\Delivery;
use App\Models\VehicleRoute;
use App\Models\Instance;

class VRPSolverService
{
    public function solve(Instance $instance)
    {
        // ---------------------------------------------------------
        // 1. Load JSON road network + settings
        // ---------------------------------------------------------
        $roads     = JsonLoader::loadRoadFiles();
        $settings  = JsonLoader::loadSettings();
        $penalties = JsonLoader::loadPenalties();
        $roadTypes = JsonLoader::loadRoadTypes();

        // ---------------------------------------------------------
        // 2. Build graph (nodes + edges)
        // ---------------------------------------------------------
        $graph = (new GraphBuilder(
            $settings['PIXEL_VALUE'],
            $roadTypes,
            $penalties
        ))->build($roads);

        $graph['edges'] = \App\Services\VRP\GraphConnectivityService::buildVirtualEdges(
        $graph['edges'],
        $graph['nodes'],
        999999 // virtual cost
    );

        // ---------------------------------------------------------
        // 3. Fetch deliveries for this instance
        // ---------------------------------------------------------
        $deliveries = Delivery::where('instance_id', $instance->id)
            ->get(['id', 'x', 'y'])
            ->toArray();

        if (count($deliveries) === 0) {
            throw new \Exception("No deliveries found for instance #{$instance->id}");
        }

        // ---------------------------------------------------------
        // 4. Snap deliveries to nearest road node
        // ---------------------------------------------------------
        $deliveryNodeMap = DeliverySnapService::snapDeliveries(
            $deliveries, 
            $graph['nodes']
        );
    
        // ---------------------------------------------------------
        // 5. Build node list for distance matrix
        // ---------------------------------------------------------
        $depotPoint = [
            'x' => $settings['DEPOT_X'],
            'y' => $settings['DEPOT_Y'],
        ];

        $depotNodeId = DeliverySnapService::snapDeliveries(
            [ ['id' => 'depot', 'x'=>$depotPoint['x'], 'y'=>$depotPoint['y']] ],
            $graph['nodes']
        )['depot'];
        // Depot *must come first*
        $points = [
            $depotNodeId,
            ...array_values($deliveryNodeMap),
        ];

        // ---------------------------------------------------------
        // 6. Build distance matrix using Dijkstra
        // ---------------------------------------------------------
        $matrixData = DistanceMatrixService::build($graph['edges'], $points);

        // ---------------------------------------------------------
        // 7. Build VRP input model
        // ---------------------------------------------------------
        $vrpModel = VRPModelBuilder::build(
            $matrixData,
            $instance->number_of_vehicles,
            $instance->max_allowed_route
        );

        // ---------------------------------------------------------
        // 8. Run Clarke–Wright Savings Algorithm
        // ---------------------------------------------------------
        $routes = ClarkeWrightService::solve($vrpModel);

        // ---------------------------------------------------------
        // 9. Convert VRP node sequences → real road paths
        // ---------------------------------------------------------
        $vehicles = PathBuilderService::buildPaths(
            $routes,
            $matrixData['points'],
            $graph['nodes'],
            $graph['edges'],
            $settings['PIXEL_VALUE']
        );

        // ---------------------------------------------------------
        // 10. Save solution to DB
        // ---------------------------------------------------------
        VehicleRoute::where('instance_id', $instance->id)->delete();

        foreach ($vehicles as $v) {
            VehicleRoute::create([
                'instance_id'    => $instance->id,
                'vehicle_number' => $v['vehicle_id'],
                'deliveries'     => $v['sequence'],
                'steps'          => $v['steps'],
                'full_path'      => $v['full_path'],
                'cost'           => $v['cost'],
            ]);
        }

        // ---------------------------------------------------------
        // 11. Return the full solved structure
        // ---------------------------------------------------------
        return $vehicles;
    }
}