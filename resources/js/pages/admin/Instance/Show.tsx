"use client";

import { usePage, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Map, PlayCircle, ListChecks, Route as RouteIcon, Network } from "lucide-react";

interface Instance {
  id: number;
  name: string;
  category: string;
  delivery_points: number;
  number_of_vehicles: number;
  max_allowed_route: number;
  comment: string;
  created_at: string;
}

interface PageProps {
  instance: Instance;
}

export default function InstanceShow() {
  const { instance } = usePage<PageProps>().props;

  return (
    <AdminLayout title={`Instance #${instance.id}`}>
      <div className="mx-auto pt-4 pb-8 px-4 lg:px-8 max-w-5xl w-full">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Instance #{instance.id}</h1>
          <p className="text-muted-foreground">
            View details, generate deliveries, and run the VRP optimization.
          </p>
        </div>

        {/* Instance Details */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Instance Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{instance.name}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Category</p>
              <Badge variant="secondary" className="mt-1">
                {instance.category}
              </Badge>
            </div>

            <div>
              <p className="text-muted-foreground">Delivery Points</p>
              <p className="font-medium">{instance.delivery_points}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Vehicles</p>
              <p className="font-medium">{instance.number_of_vehicles}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Max Allowed Route</p>
              <p className="font-medium">{instance.max_allowed_route}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Created At</p>
              <p className="font-medium">
                {new Date(instance.created_at).toLocaleString()}
              </p>
            </div>

            {instance.comment && (
              <div className="md:col-span-2">
                <p className="text-muted-foreground">Comment</p>
                <p className="font-medium">{instance.comment}</p>
              </div>
            )}

          </div>
        </Card>

        {/* Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Actions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">

            {/* Generate Deliveries */}
            <Button
              className="w-full flex items-center gap-2"
              onClick={() =>
                router.get(`/admin/instances/${instance.id}/generate`)
              }
            >
              <PlayCircle className="h-4 w-4" />
              Generate Deliveries
            </Button>

            {/* Solve VRP */}
            <Button 
              className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
              onClick={() =>
                router.get(`/admin/instances/${instance.id}/solve`)
              }
            >
              <RouteIcon className="h-4 w-4" />
              Solve Routes
            </Button>

            {/* View Deliveries */}
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() =>
                router.get(`/admin/deliveries?filter[instance_id]=${instance.id}`)
              }
            >
              <ListChecks className="h-4 w-4" />
              View Deliveries
            </Button>

            {/* NEW: Road Network Viewer */}
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() =>
                router.get(`/admin/instances/${instance.id}/road-network`)
              }
            >
              <Network className="h-4 w-4" />
              Road Network
            </Button>

            {/* NEW: VRP Solution Viewer */}
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() =>
                router.get(`/admin/instances/${instance.id}/routes`)
              }
            >
              <Map className="h-4 w-4" />
              VRP Solution
            </Button>

          </div>
        </Card>

      </div>
    </AdminLayout>
  );
}