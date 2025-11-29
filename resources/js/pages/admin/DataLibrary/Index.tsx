"use client";
import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

import { Search, Database, Map, Layers, MapPin, Info } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DataLibraryIndex() {
  const { general = {}, penalties = {}, roadTypes = {}, counts = {} } =
    usePage().props;

  // Beginner-friendly descriptions for each dataset
  const descriptions = {
    Avenues:
      "Medium-to-large roads connecting major sections of the city. Often used in primary routing.",
    Streets:
      "Local neighborhood roads. Important for final delivery steps and residential access.",
    Paths:
      "Smaller paths or service passages. Used for short connections or pedestrian pathways.",
    Highways:
      "Fast, long-distance roads. Extremely important for major travel and route optimization.",
    Links:
      "Tiny connector roads that help transition between bigger roads. Crucial for routing flexibility.",
    "Municipal Roads":
      "Rural or less developed roads outside the central urban grid.",
    Plazas:
      "Open squares or central hubs connecting multiple roads together.",
    Roundabouts:
      "Circular intersections that redirect traffic flow smoothly.",
  };

  return (
    <AdminLayout title="Data Library">
      <div className="mx-auto pt-4 pb-8 px-4 lg:px-8 max-w-6xl w-full">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Database className="h-7 w-7 text-orange-500" />
            Data Library
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            This section contains all the datasets used by the VRP routing
            engine. Each category includes detailed road structures, penalties,
            and coordinate paths used to calculate routing cost.
          </p>
        </div>

        <Card className="p-6">


          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dataset sections (Avenues, Streets, Highways...)"
                className="pl-10"
              />
            </div>
          </div>

          {/* Dataset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">

            <DatasetCard
              title="Avenues"
              description={descriptions.Avenues}
              count={counts.avenues ?? 0}
              href="/admin/data-library/avenues"
              icon={<Map className="h-6 w-6 text-orange-400" />}
            />

            <DatasetCard
              title="Streets"
              description={descriptions.Streets}
              count={counts.streets ?? 0}
              href="/admin/data-library/streets"
              icon={<MapPin className="h-6 w-6 text-orange-400" />}
            />

            <DatasetCard
              title="Paths"
              description={descriptions.Paths}
              count={counts.paths ?? 0}
              href="/admin/data-library/paths"
              icon={<Map className="h-6 w-6 text-orange-400" />}
            />

            <DatasetCard
              title="Highways"
              description={descriptions.Highways}
              count={counts.highways ?? 0}
              href="/admin/data-library/highways"
              icon={<Layers className="h-6 w-6 text-orange-400" />}
            />

            <DatasetCard
              title="Links"
              description={descriptions.Links}
              count={counts.links ?? 0}
              href="/admin/data-library/links"
              icon={<Database className="h-6 w-6 text-orange-400" />}
            />

            <DatasetCard
              title="Municipal Roads"
              description={descriptions["Municipal Roads"]}
              count={counts.municipal ?? 0}
              href="/admin/data-library/municipal"
              icon={<MapPin className="h-6 w-6 text-orange-400" />}
            />

            <DatasetCard
              title="Plazas"
              description={descriptions.Plazas}
              count={counts.plazas ?? 0}
              href="/admin/data-library/plazas"
              icon={<Map className="h-6 w-6 text-orange-400" />}
            />

            <DatasetCard
              title="Roundabouts"
              description={descriptions.Roundabouts}
              count={counts.roundabouts ?? 0}
              href="/admin/data-library/roundabouts"
              icon={<Layers className="h-6 w-6 text-orange-400" />}
            />

          </div>

          {/* General Settings */}
          <Section title="General Settings">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InfoBox label="Depot X" value={general?.DEPOT_X ?? "—"} />
              <InfoBox label="Depot Y" value={general?.DEPOT_Y ?? "—"} />
              <InfoBox label="Pixel Value" value={general?.PIXEL_VALUE ?? "—"} />
            </div>
          </Section>

          {/* Penalties */}
          <Section title="Penalties">
            <Card className="p-4 bg-gray-900 border border-gray-700 mb-4">
              <h3 className="font-bold mb-2 text-orange-400">Zones</h3>
              <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(penalties?.zones ?? {}, null, 2)}
              </pre>
            </Card>

            <Card className="p-4 bg-gray-900 border border-gray-700">
              <h3 className="font-bold mb-2 text-orange-400">Categories</h3>
              <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(penalties?.categories ?? {}, null, 2)}
              </pre>
            </Card>
          </Section>

          {/* Road Types */}
          <Section title="Road Types">
            <Card className="p-4 bg-gray-900 border border-gray-700">
              <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(roadTypes ?? {}, null, 2)}
              </pre>
            </Card>
          </Section>

        </Card>
      </div>
    </AdminLayout>
  );
}

function DatasetCard({ title, description, count, icon, href }) {
  return (
    <a href={href}>
      <Card className="p-5 hover:bg-gray-800 transition border border-gray-700 cursor-pointer h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <div>{icon}</div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{description}</p>

        <div className="mt-auto">
          <p className="text-3xl font-bold">{count}</p>
          <p className="text-sm text-orange-400 mt-1">View details →</p>
        </div>
      </Card>
    </a>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Info className="h-5 w-5 text-orange-400" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <Card className="p-4 bg-gray-900 border border-gray-700 text-sm">
      <strong className="block text-orange-400 mb-1">{label}:</strong>
      <span>{value}</span>
    </Card>
  );
}