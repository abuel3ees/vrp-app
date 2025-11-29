"use client";

import { usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

import { ArrowLeft, Map, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RoadDetail() {
  const { category, index, road } = usePage().props;

  const readableCategory = category
    .replace(".json", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const colorMap = {
    AVENUE: "#4F9EFF",
    LARGEAVENUE: "#0067C8",
    STREET: "#FFA826",
    PATH: "#8A8A8A",
    HIGHWAY: "#00D983",
    LINK: "#B28DFF",
    MUNICIPAL: "#F54291",
    PLAZA: "#FFD966",
    ROUNDABOUT: "#FF5E5E",
  };

  const color = colorMap[road.type] ?? "#ffffff";

  return (
    <AdminLayout title={`${road.name} — ${readableCategory}`}>
      <div className="max-w-6xl mx-auto py-8 px-4">

        {/* Back Button */}
        <a
          href={`/admin/data-library/${category}`}
          className="flex items-center text-orange-400 hover:underline mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to {readableCategory}
        </a>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Map className="text-orange-500" />
            {road.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Detailed visualization of the road geometry, penalties, and coordinates.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAP SECTION */}
          <Card className="lg:col-span-2 p-5 bg-gray-900 border border-gray-800">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Info size={18} className="text-orange-400" />
              Full Road Map View
            </h2>

            <div className="rounded-lg overflow-hidden bg-gray-800 p-3 flex justify-center">
              <FullMap road={road} color={color} />
            </div>
          </Card>

          {/* INFO SECTION */}
          <Card className="p-6 bg-gray-900 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Road Information</h2>

            <InfoRow label="Name" value={road.name} />
            <InfoRow
              label="Road Type"
              value={
                <Badge style={{ backgroundColor: color }} className="text-black">
                  {road.type}
                </Badge>
              }
            />
            <InfoRow label="Zone Penalty" value={road.penalties[0]} />
            <InfoRow label="Category Penalty" value={road.penalties[2]} />
            <InfoRow label="Coordinate Count" value={`${road.coordinates.length} points`} />
          </Card>

        </div>

        {/* COORDINATES SECTION */}
        <Card className="p-6 mt-10 bg-gray-900 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Coordinates</h2>

          <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto max-h-96 border border-gray-700">
            {JSON.stringify(road.coordinates, null, 2)}
          </pre>
        </Card>

      </div>
    </AdminLayout>
  );
}

/* Info row component */
function InfoRow({ label, value }) {
  return (
    <div className="mb-4">
      <strong className="block text-orange-400 mb-1">{label}:</strong>
      <div className="text-sm">{value}</div>
    </div>
  );
}

/* Full map canvas */
function FullMap({ road, color }) {
  const width = 700;
  const height = 400;

  const points = road.coordinates;

  if (!points || points.length < 2) {
    return (
      <div className="text-gray-400 text-center py-10">
        Not enough coordinates to render map.
      </div>
    );
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const scale = Math.min(
    width / Math.max(1, maxX - minX),
    height / Math.max(1, maxY - minY)
  );

  const path = points
    .map((p, i) => {
      const x = (p.x - minX) * scale;
      const y = (p.y - minY) * scale;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="rounded bg-gray-900 shadow-xl">
      <path
        d={path}
        stroke={color}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}