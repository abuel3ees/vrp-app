"use client";

import { useState } from "react";
import { usePage, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Map,
  PlayCircle,
  ListChecks,
  Route as RouteIcon,
  Network,
  Loader2,
  Activity,
  Sparkles,
} from "lucide-react";

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

function RouteSolvingOverlay({ instance }: { instance: Instance }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-2xl">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-40 w-40 rounded-full bg-emerald-500/25 blur-3xl" />
        <div className="absolute -bottom-28 -right-10 h-52 w-52 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.07] mix-blend-soft-light bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.6),transparent_60%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.4),transparent_60%)]" />
      </div>

      <div className="relative w-full max-w-md mx-4 rounded-3xl border border-white/12 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 p-6 shadow-[0_0_50px_rgba(34,197,94,0.6)]">
        {/* header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/60 shadow-[0_0_28px_rgba(34,197,94,0.8)]">
              <Loader2 className="h-5 w-5 text-emerald-300 animate-spin" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-200/90 flex items-center gap-1">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(34,197,94,0.9)]" />
                Solving routes
              </span>
              <h2 className="text-sm font-semibold text-white">
                Instance #{instance.id} · {instance.name}
              </h2>
            </div>
          </div>
          <Sparkles className="h-5 w-5 text-orange-300/80" />
        </div>

        {/* body text */}
        <p className="text-xs text-slate-200/90 mb-3">
          Your VRP solver is currently building routes for{" "}
          <span className="font-semibold text-white">
            {instance.delivery_points}
          </span>{" "}
          stops across{" "}
          <span className="font-semibold text-white">
            {instance.number_of_vehicles}
          </span>{" "}
          vehicles.
        </p>
        <p className="text-[11px] text-slate-300/80 mb-4">
          This can take a moment depending on your constraints, penalties, and
          max route length. You can keep this tab in view or check something
          else — we’ll bring the routes back as soon as they’re ready.
        </p>

        {/* fake progress bar */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-300/80">
            <span className="flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-emerald-300" />
              <span>Optimization wave</span>
            </span>
            <span className="text-slate-400/80">
              Searching for cheaper patterns...
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-orange-400 animate-[progressSlide_1.3s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* checklist */}
        <div className="space-y-1.5 text-[11px] text-slate-200/90">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5 mb-1">
            <span className="h-1 w-4 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-orange-400" />
            Under the hood
          </p>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <span>Packing stops into vehicles while respecting max route length.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-sky-300" />
              <span>Checking for cheaper permutations and better neighbourhood moves.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-orange-300" />
              <span>Stitching paths into a consistent, driver-ready day.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Keyframes for progress animation - using inline style tag */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progressSlide {
          0% { transform: translateX(-60%); }
          50% { transform: translateX(10%); }
          100% { transform: translateX(120%); }
        }
      `}} />
    </div>
  );
}

interface PageProps {
  instance: Instance;
  [key: string]: unknown;
}

export default function InstanceShow() {
  const { instance } = usePage<PageProps>().props;
  const [isSolving, setIsSolving] = useState(false);

  const handleGenerate = () => {
    router.get(`/admin/instances/${instance.id}/generate`, {
      preserveScroll: true,
    });
  };

  const handleSolve = () => {
    setIsSolving(true);
    router.get(`/admin/instances/${instance.id}/solve`, {
      preserveScroll: true,
    });
  };

  return (
    <AdminLayout>
      {/* fancy overlay when solving */}
      {isSolving && <RouteSolvingOverlay instance={instance} />}

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
              onClick={handleGenerate}
            >
              <PlayCircle className="h-4 w-4" />
              Generate Deliveries
            </Button>

            {/* Solve VRP */}
            <Button
              className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
              disabled={isSolving}
              onClick={handleSolve}
            >
              {isSolving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RouteIcon className="h-4 w-4" />
              )}
              <span>{isSolving ? "Solving routes..." : "Solve Routes"}</span>
            </Button>

            {/* View Deliveries */}
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() =>
                router.get(
                  `/admin/deliveries?filter[instance_id]=${instance.id}`
                )
              }
            >
              <ListChecks className="h-4 w-4" />
              View Deliveries
            </Button>

            {/* Road Network Viewer */}
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

            {/* VRP Solution Viewer */}
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