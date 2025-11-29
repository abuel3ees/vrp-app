"use client";

import { useState, useMemo } from "react";
import { usePage } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";
import { Search, Map, Eye } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CategoryIndex() {
  const { category, roads } = usePage().props;

  const [search, setSearch] = useState("");
  const [hoveredRoad, setHoveredRoad] = useState(null);

  // Friendly readable title
  const readable = category
    .replace(".json", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Friendly description
  const descriptions = {
    avenues: "Avenues are medium-to-large roads that connect major areas.",
    streets: "Streets are local roads for residential and smaller routes.",
    paths: "Paths are small connectors or service routes.",
    highways: "Highways are main fast roads with no stops.",
    links: "Links are short connector roads between major segments.",
    municipal_roads: "Municipal roads connect rural or outskirt regions.",
    plazas: "Plazas are central connecting areas.",
    roundabouts: "Roundabouts help direct traffic at intersections."
  };

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

  const filtered = useMemo(() => {
    return roads.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, roads]);

  return (
    <AdminLayout title={`Data Library — ${readable}`}>
      <div className="max-w-6xl mx-auto py-8 px-4 lg:px-0">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Map className="text-orange-500" />
            {readable}
          </h1>
          <p className="text-muted-foreground mt-2">
            {descriptions[category] ?? "Road dataset."}
          </p>
        </div>

        <Card className="p-6">

          {/* SEARCH */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${readable} by name...`}
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Zone</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Coords</th>
                  <th className="p-3 text-left">Preview</th>
                  <th className="p-3 text-left"></th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((road, index) => {
                  const color = colorMap[road.type] ?? "#FFF";

                  return (
                    <tr
                      key={index}
                      className="border-t border-gray-800 hover:bg-gray-900 transition"
                      onMouseEnter={() => setHoveredRoad(road)}
                    >
                      {/* NAME */}
                      <td className="p-3 font-medium">{road.name}</td>

                      {/* ROAD TYPE */}
                      <td className="p-3">
                        <Badge style={{ backgroundColor: color }}>
                          {road.type}
                        </Badge>
                      </td>

                      {/* ZONE */}
                      <td className="p-3">{road.penalties[0]}</td>

                      {/* CATEGORY */}
                      <td className="p-3">{road.penalties[2]}</td>

                      {/* COORDINATES COUNT */}
                      <td className="p-3">
                        {road.coordinates.length} pts
                      </td>

                      {/* MINI MAP */}
                      <td className="p-3">
                        <MiniMap road={road} color={color} />
                      </td>

                      {/* VIEW BUTTON */}
                      <td className="p-3 text-right">
                        <a
                          href={`/admin/data-library/${category}/${index}`}
                          className="text-orange-400 hover:underline flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </Card>

      </div>
    </AdminLayout>
  );
}

/* --- Mini-map Component (Canvas) --- */

function MiniMap({ road, color }) {
  const width = 120;
  const height = 80;

  // Normalize coordinates into the mini canvas
  const points = road.coordinates;

  if (points.length < 2) return <div className="text-gray-500">—</div>;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const scale = Math.min(
    width / (maxX - minX || 1),
    height / (maxY - minY || 1)
  );

  const path = points
    .map((p, i) => {
      const x = (p.x - minX) * scale;
      const y = (p.y - minY) * scale;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="rounded bg-gray-800">
      <path
        d={path}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}