"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { usePage, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

import mapboxgl, { GeoJSONSource, LngLatBoundsLike } from "mapbox-gl";
import * as turf from "@turf/turf";
import {
  Play,
  Pause,
  RotateCw,
  Map as MapIcon,
  Gauge,
  Timer,
  Truck,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// ------------------------------------------
// GRID → LAT/LNG PROJECTION (Brazil baseline)
// ------------------------------------------
const BASE_LAT = -15.78;
const BASE_LNG = -47.93;
const SCALE = 0.00005;

function convertPoint(x: number, y: number) {
  return {
    lat: BASE_LAT + y * SCALE,
    lng: BASE_LNG + x * SCALE,
  };
}

// ------------------------------------------
// TYPES
// ------------------------------------------
interface StepPoint {
  x: number;
  y: number;
}

interface LatLngPoint {
  lat: number;
  lng: number;
}

interface VehicleRoute {
  id: number;
  vehicle_number: number;
  deliveries: number[];
  steps: StepPoint[];
  full_path: LatLngPoint[];
  cost: number;
}

interface DeliveryNode {
  id: number;
  x: number;
  y: number;
}

interface Props {
  instance: { id: number; name: string; category?: string };
  routes: VehicleRoute[];
  nodes: DeliveryNode[];
}

// Route quality vs average cost
function getRouteQuality(cost: number, avgCost: number) {
  if (!avgCost || !isFinite(avgCost)) {
    return {
      label: "—",
      className: "text-slate-400 bg-slate-900/60 border-slate-700/80",
    };
  }

  const ratio = cost / avgCost;

  if (ratio < 0.8) {
    return {
      label: "Efficient",
      className: "text-emerald-300 bg-emerald-500/15 border-emerald-500/40",
    };
  }
  if (ratio < 1.2) {
    return {
      label: "Balanced",
      className: "text-sky-300 bg-sky-500/15 border-sky-500/40",
    };
  }
  return {
    label: "Heavy",
    className: "text-amber-300 bg-amber-500/10 border-amber-500/40",
  };
}

// ------------------------------------------

export default function RoutesPage() {
  const { instance, routes, nodes } = usePage<Props>().props;

  // ------------------------------------------
  // COLORS & METRICS
  // ------------------------------------------
  const coloredRoutes = useMemo(
    () =>
      routes.map((r, i) => ({
        ...r,
        color: ["#22c55e", "#0ea5e9", "#f97316", "#a855f7", "#facc15", "#ec4899"][i % 6],
      })),
    [routes]
  );

  const totalDeliveries = nodes.length;
  const totalVehicles = routes.length;
  const totalCost = useMemo(
    () => routes.reduce((sum, r) => sum + (r.cost || 0), 0),
    [routes]
  );
  const avgCost = totalVehicles ? totalCost / totalVehicles : 0;
  const avgStops =
    totalVehicles &&
    coloredRoutes.reduce((s, r) => s + r.deliveries.length, 0) / totalVehicles;

  // ------------------------------------------
  // STEP → LAT/LNG & ROUTES
  // ------------------------------------------
  const projectedRoutes = useMemo(
    () =>
      coloredRoutes.map((r) => ({
        ...r,
        steps: r.steps?.map((p) => convertPoint(p.x, p.y)) || [],
        full_path: r.full_path || [],
      })),
    [coloredRoutes]
  );

  // Per-route metrics (distance, stops, cost)
  const routeMetrics = useMemo(() => {
    return projectedRoutes.map((r) => {
      let distanceKm = 0;
      if (r.full_path && r.full_path.length >= 2) {
        try {
          const line = turf.lineString(
            r.full_path.map((p) => [p.lng, p.lat]) as [number, number][]
          );
          distanceKm = turf.length(line as any, { units: "kilometers" });
        } catch {
          distanceKm = 0;
        }
      }
      return {
        id: r.id,
        vehicle_number: r.vehicle_number,
        color: r.color,
        cost: r.cost,
        distanceKm,
        stops: r.deliveries.length,
      };
    });
  }, [projectedRoutes]);

  const fleetDistanceKm = useMemo(
    () => routeMetrics.reduce((sum, m) => sum + (m.distanceKm || 0), 0),
    [routeMetrics]
  );

  const [vehicleIndex, setVehicleIndex] = useState(0);
  const activeRoute = projectedRoutes[vehicleIndex];
  const activeMetrics = routeMetrics[vehicleIndex];

  // ------------------------------------------
  // ACTIVE ROUTE + PLAYBACK
  // ------------------------------------------
  const [progress, setProgress] = useState(0); // 0 → 1
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3); // 1–10
  const [sidebarTab, setSidebarTab] = useState<"overview" | "stops">("overview");
  const [cinematicMode, setCinematicMode] = useState(true);
  const prevVehicleIndexRef = useRef(0);
  const [hoveredStopId, setHoveredStopId] = useState<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [autoplayFleet, setAutoplayFleet] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const activeFullPath = activeRoute?.full_path || [];
  const activeSteps = activeRoute?.steps || [];
  const hasRoute = activeSteps.length >= 2;

  const stopsCount = activeRoute?.deliveries.length ?? 0;
  const currentStopIdx = useMemo(() => {
    if (!activeRoute || stopsCount === 0) return 0;
    const clamped = Math.max(0, Math.min(1, progress));
    return Math.min(stopsCount - 1, Math.floor(clamped * stopsCount));
  }, [activeRoute, stopsCount, progress]);

  const routeQuality =
    activeRoute != null ? getRouteQuality(activeRoute.cost, avgCost) : getRouteQuality(0, 0);

  const selectedNode = useMemo(
    () =>
      selectedNodeId != null
        ? nodes.find((n) => n.id === selectedNodeId) || null
        : null,
    [selectedNodeId, nodes]
  );

  const selectedNodeIndexInRoute = useMemo(
    () =>
      activeRoute && selectedNodeId != null
        ? activeRoute.deliveries.indexOf(selectedNodeId)
        : -1,
    [activeRoute, selectedNodeId]
  );

  const selectedNodeLatLng = useMemo(
    () =>
      selectedNode
        ? convertPoint(selectedNode.x, selectedNode.y)
        : null,
    [selectedNode]
  );

  // Full route line
  const baseLine = useMemo(() => {
    if (!activeFullPath || activeFullPath.length < 2) return null;
    return turf.lineString(activeFullPath.map((p) => [p.lng, p.lat]));
  }, [activeFullPath]);

  // Distance analytics: total, traveled, remaining
  const activeDistance = useMemo(() => {
    if (!baseLine) {
      return { total: null as number | null, traveled: null as number | null, remaining: null as number | null };
    }
    try {
      const total = turf.length(baseLine as any, { units: "kilometers" });
      const clamped = Math.max(0, Math.min(1, progress));
      const traveled = total * clamped;
      const remaining = total - traveled;
      return { total, traveled, remaining };
    } catch {
      return { total: null, traveled: null, remaining: null };
    }
  }, [baseLine, progress]);

  const etaMinutes = useMemo(() => {
    if (!activeDistance.remaining || activeDistance.remaining <= 0) return null;
    // assume 30 km/h → 2 minutes per km
    return activeDistance.remaining * 2;
  }, [activeDistance.remaining]);

  // Partial progress line (glow trail)
  const partialLine = useMemo(() => {
    if (!activeFullPath || activeFullPath.length < 2) return null;

    const totalSegments = activeFullPath.length - 1;
    const clamped = Math.max(0, Math.min(1, progress));
    const scaled = clamped * totalSegments;
    const segIndex = Math.min(Math.floor(scaled), totalSegments - 1);
    const t = scaled - segIndex;

    const coords: [number, number][] = [];

    for (let i = 0; i <= segIndex; i++) {
      coords.push([activeFullPath[i].lng, activeFullPath[i].lat]);
    }

    const start = activeFullPath[segIndex];
    const end = activeFullPath[segIndex + 1];

    const currLng = start.lng + (end.lng - start.lng) * t;
    const currLat = start.lat + (end.lat - start.lat) * t;
    coords.push([currLng, currLat]);

    return turf.lineString(coords);
  }, [activeFullPath, progress]);

  // ------------------------------------------
  // MAP STATE
  // ------------------------------------------
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapLoadedRef = useRef(false);
  const hasInitialFitRef = useRef(false);
  const vehicleFeatureRef = useRef<any | null>(null);

  // Delivery Node GeoJSON
  const nodeGeoJSON = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: nodes.map((n) => {
        const p = convertPoint(n.x, n.y);
        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [p.lng, p.lat] as [number, number],
          },
          properties: { id: n.id },
        };
      }),
    }),
    [nodes]
  );

  // All routes ghost layer
  const allRoutesGeoJSON = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: projectedRoutes
        .filter((r) => r.full_path && r.full_path.length >= 2)
        .map((r) => ({
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: r.full_path.map((p) => [p.lng, p.lat]) as [number, number][],
          },
          properties: {
            vehicle_number: r.vehicle_number,
            color: r.color,
          },
        })),
    }),
    [projectedRoutes]
  );

  // Fleet extremes: best cost, worst cost, longest distance
  const fleetExtremes = useMemo(() => {
    if (!routeMetrics.length) {
      return {
        bestCost: null as (typeof routeMetrics)[number] | null,
        worstCost: null as (typeof routeMetrics)[number] | null,
        longest: null as (typeof routeMetrics)[number] | null,
      };
    }
    let best = routeMetrics[0];
    let worst = routeMetrics[0];
    let longest = routeMetrics[0];

    for (const m of routeMetrics) {
      if (m.cost < best.cost) best = m;
      if (m.cost > worst.cost) worst = m;
      if (m.distanceKm > longest.distanceKm) longest = m;
    }

    return { bestCost: best, worstCost: worst, longest };
  }, [routeMetrics]);

  // Reset animation when switching vehicle
  useEffect(() => {
    if (prevVehicleIndexRef.current !== vehicleIndex) {
      prevVehicleIndexRef.current = vehicleIndex;
      setProgress(0);
      setPlaying(false);
      setHoveredStopId(null);
      setSelectedNodeId(null);
    }
  }, [vehicleIndex]);

  // Auto-stop playback at end
  useEffect(() => {
    if (progress >= 1 && playing) {
      setPlaying(false);
    }
  }, [progress, playing]);

  // Autoplay across fleet
  useEffect(() => {
    if (!autoplayFleet) return;
    if (!routes.length) return;
    if (playing) return;
    if (progress < 1) return;
    if (!hasRoute) return;

    const timeout = setTimeout(() => {
      setVehicleIndex((prev) => {
        const next = (prev + 1) % routes.length;
        return next;
      });
      setProgress(0);
      setPlaying(true);
    }, 800);

    return () => clearTimeout(timeout);
  }, [autoplayFleet, routes.length, playing, progress, hasRoute]);

  // INIT MAP
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [BASE_LNG, BASE_LAT],
      zoom: 12,
      antialias: true,
    });

    map.current.on("load", () => {
      if (!map.current) return;
      mapLoadedRef.current = true;
      setMapReady(true);

      // NODES
      map.current.addSource("nodes", {
        type: "geojson",
        data: nodeGeoJSON,
      });

      map.current.addLayer({
        id: "nodes-layer",
        type: "circle",
        source: "nodes",
        paint: {
          "circle-radius": 4,
          "circle-color": "#fbbf24",
          "circle-stroke-color": "#020617",
          "circle-stroke-width": 1.5,
          "circle-opacity": 0.85,
        },
      });

      // Active nodes
      map.current.addLayer({
        id: "nodes-active-layer",
        type: "circle",
        source: "nodes",
        paint: {
          "circle-radius": 7,
          "circle-color": "#22c55e",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-opacity": 0.0,
          "circle-blur": 0.6,
        },
      });

      // Hover layer
      map.current.addLayer({
        id: "nodes-hover-layer",
        type: "circle",
        source: "nodes",
        paint: {
          "circle-radius": 8,
          "circle-color": "#38bdf8",
          "circle-stroke-color": "#e0f2fe",
          "circle-stroke-width": 2,
          "circle-opacity": 0.0,
          "circle-blur": 0.4,
        },
      });

      // All routes ghost layer
      map.current.addSource("routes-all", {
        type: "geojson",
        data: allRoutesGeoJSON,
      });

      map.current.addLayer({
        id: "routes-all-layer",
        type: "line",
        source: "routes-all",
        paint: {
          "line-color": ["get", "color"],
          "line-width": 2,
          "line-opacity": 0.12,
        },
      });

      // Active route sources
      map.current.addSource("route-base", {
        type: "geojson",
        data:
          baseLine || ({
            type: "Feature",
            geometry: { type: "LineString", coordinates: [] },
          } as any),
      });

      map.current.addSource("route-progress", {
        type: "geojson",
        data:
          partialLine || ({
            type: "Feature",
            geometry: { type: "LineString", coordinates: [] },
          } as any),
        // @ts-expect-error not in type defs
        lineMetrics: true,
      });

      // Base route
      map.current.addLayer({
        id: "route-base-layer",
        type: "line",
        source: "route-base",
        paint: {
          "line-color": "#64748b",
          "line-width": 3,
          "line-opacity": 0.35,
        },
      });

      // Progress route (gradient)
      map.current.addLayer({
        id: "route-progress-layer",
        type: "line",
        source: "route-progress",
        paint: {
          "line-width": 5,
          "line-opacity": 0.95,
          "line-blur": 0.3,
          "line-gradient": [
            "interpolate",
            ["linear"],
            ["line-progress"],
            0,
            projectedRoutes[0]?.color || "#22c55e",
            1,
            "#0ea5e9",
          ],
        },
      });

      // Start / end markers
      map.current.addSource("route-start", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      map.current.addSource("route-end", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.current.addLayer({
        id: "route-start-layer",
        type: "circle",
        source: "route-start",
        paint: {
          "circle-radius": 5,
          "circle-color": "#22c55e",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-opacity": 1,
        },
      });

      map.current.addLayer({
        id: "route-end-layer",
        type: "circle",
        source: "route-end",
        paint: {
          "circle-radius": 5,
          "circle-color": "#f97316",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-opacity": 1,
        },
      });

      // VEHICLE SOURCE
      const first =
        activeSteps[0] != null ? [activeSteps[0].lng, activeSteps[0].lat] : [BASE_LNG, BASE_LAT];

      const initialVehicleFeature: any = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: first,
        },
        properties: {
          bearing: 0,
          color: projectedRoutes[0]?.color || "#22c55e",
          pulse: 0.5,
        },
      };
      vehicleFeatureRef.current = initialVehicleFeature;

      map.current.addSource("vehicle", {
        type: "geojson",
        data: initialVehicleFeature,
      });

      map.current.addLayer({
        id: "vehicle-layer",
        type: "circle",
        source: "vehicle",
        paint: {
          "circle-radius": 7,
          "circle-color": ["get", "color"],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-blur": 0.3,
        },
      });

      map.current.addLayer({
        id: "vehicle-radar-layer",
        type: "circle",
        source: "vehicle",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "pulse"],
            0,
            10,
            1,
            22,
          ],
          "circle-color": ["get", "color"],
          "circle-opacity": 0.25,
          "circle-blur": 1.2,
        },
      });

      // ONE-TIME GLOBAL FIT
      if (!hasInitialFitRef.current) {
        const bboxItems: [number, number][] = [];

        nodeGeoJSON.features.forEach((f) => {
          const [lng, lat] = f.geometry.coordinates;
          bboxItems.push([lng, lat]);
        });
        if (activeFullPath.length > 0) {
          activeFullPath.forEach((p) => bboxItems.push([p.lng, p.lat]));
        }

        if (bboxItems.length > 0) {
          const lons = bboxItems.map((c) => c[0]);
          const lats = bboxItems.map((c) => c[1]);
          const minLng = Math.min(...lons);
          const maxLng = Math.max(...lons);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);

          map.current.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ] as LngLatBoundsLike,
            { padding: 80 }
          );
        }

        hasInitialFitRef.current = true;
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
      mapLoadedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep nodes source fresh
  useEffect(() => {
    if (!map.current || !mapLoadedRef.current) return;
    const src = map.current.getSource("nodes") as GeoJSONSource | null;
    if (src) {
      src.setData(nodeGeoJSON as any);
    }
  }, [nodeGeoJSON]);

  // Keep all routes ghost layer fresh
  useEffect(() => {
    if (!map.current || !mapLoadedRef.current) return;
    const src = map.current.getSource("routes-all") as GeoJSONSource | null;
    if (src) {
      src.setData(allRoutesGeoJSON as any);
    }
  }, [allRoutesGeoJSON]);

  // Update routes, active nodes, gradient, markers
  useEffect(() => {
    if (!map.current || !mapLoadedRef.current) return;

    const baseSrc = map.current.getSource("route-base") as GeoJSONSource | null;
    const progSrc = map.current.getSource("route-progress") as GeoJSONSource | null;

    if (baseSrc) {
      baseSrc.setData(
        baseLine || ({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        } as any)
      );
    }

    if (progSrc) {
      progSrc.setData(
        partialLine || ({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [],
          },
        } as any)
      );
    }

    const color = activeRoute?.color || "#22c55e";

    if (map.current.getLayer("route-progress-layer")) {
      map.current.setPaintProperty("route-progress-layer", "line-gradient", [
        "interpolate",
        ["linear"],
        ["line-progress"],
        0,
        color,
        1,
        "#0ea5e9",
      ]);
      map.current.setPaintProperty(
        "route-progress-layer",
        "line-width",
        cinematicMode ? 6 : 5
      );
      map.current.setPaintProperty(
        "route-progress-layer",
        "line-blur",
        cinematicMode ? 0.5 : 0.3
      );
    }

    // Active nodes (deliveries of this vehicle)
    const activeIds = activeRoute?.deliveries || [];
    if (map.current.getLayer("nodes-active-layer")) {
      if (activeIds.length > 0) {
        map.current.setFilter("nodes-active-layer", [
          "in",
          ["get", "id"],
          ["literal", activeIds],
        ]);
        map.current.setPaintProperty("nodes-active-layer", "circle-opacity", 0.9);
      } else {
        map.current.setFilter("nodes-active-layer", [
          "in",
          ["get", "id"],
          ["literal", []],
        ]);
        map.current.setPaintProperty("nodes-active-layer", "circle-opacity", 0.0);
      }
    }

    // Start / end markers for active route
    if (map.current.getSource("route-start")) {
      const startSrc = map.current.getSource("route-start") as GeoJSONSource;
      const endSrc = map.current.getSource("route-end") as GeoJSONSource;

      if (activeSteps.length > 0) {
        const start = activeSteps[0];
        const end = activeSteps[activeSteps.length - 1];

        startSrc.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [start.lng, start.lat],
              },
              properties: {},
            },
          ],
        } as any);

        endSrc.setData({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [end.lng, end.lat],
              },
              properties: {},
            },
          ],
        } as any);
      } else {
        startSrc.setData({
          type: "FeatureCollection",
          features: [],
        } as any);
        endSrc.setData({
          type: "FeatureCollection",
          features: [],
        } as any);
      }
    }

    // Ghost layer opacity: highlight active route
    if (map.current.getLayer("routes-all-layer")) {
      const activeVehicleNumber = activeRoute?.vehicle_number ?? -1;
      map.current.setPaintProperty("routes-all-layer", "line-opacity", [
        "case",
        ["==", ["get", "vehicle_number"], activeVehicleNumber],
        cinematicMode ? 0.45 : 0.3,
        0.08,
      ]);
    }

    // Radar tuning
    if (map.current.getLayer("vehicle-radar-layer")) {
      map.current.setPaintProperty("vehicle-radar-layer", "circle-radius", [
        "interpolate",
        ["linear"],
        ["get", "pulse"],
        0,
        cinematicMode ? 12 : 10,
        1,
        cinematicMode ? 26 : 22,
      ]);
      map.current.setPaintProperty(
        "vehicle-radar-layer",
        "circle-opacity",
        cinematicMode ? 0.32 : 0.25
      );
    }
  }, [vehicleIndex, baseLine, partialLine, activeRoute, activeSteps, cinematicMode]);

  // Hover highlight + gentle pan
  useEffect(() => {
    if (!map.current || !mapLoadedRef.current) return;

    if (map.current.getLayer("nodes-hover-layer")) {
      if (hoveredStopId != null) {
        map.current.setFilter("nodes-hover-layer", ["==", ["get", "id"], hoveredStopId]);
        map.current.setPaintProperty("nodes-hover-layer", "circle-opacity", 1.0);

        const node = nodes.find((n) => n.id === hoveredStopId);
        if (node) {
          const p = convertPoint(node.x, node.y);
          map.current.easeTo({
            center: [p.lng, p.lat],
            duration: 600,
            zoom: Math.max(map.current.getZoom(), 13),
          });
        }
      } else {
        map.current.setFilter("nodes-hover-layer", ["==", ["get", "id"], -999999]);
        map.current.setPaintProperty("nodes-hover-layer", "circle-opacity", 0.0);
      }
    }
  }, [hoveredStopId, nodes]);

  // Click nodes to select
  useEffect(() => {
    if (!map.current || !mapLoadedRef.current) return;

    const handleClick = (e: any) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ["nodes-layer", "nodes-active-layer"],
      });
      if (!features.length) return;
      const f = features[0];
      const rawId = f.properties && (f.properties as any).id;
      const parsedId =
        typeof rawId === "number"
          ? rawId
          : rawId != null
          ? parseInt(rawId, 10)
          : NaN;
      if (!isNaN(parsedId)) {
        setSelectedNodeId(parsedId);
        setHoveredStopId(parsedId);
      }
    };

    map.current.on("click", "nodes-layer", handleClick);
    map.current.on("click", "nodes-active-layer", handleClick);

    return () => {
      if (!map.current) return;
      map.current.off("click", "nodes-layer", handleClick);
      map.current.off("click", "nodes-active-layer", handleClick);
    };
  }, []);

  // Playback animation: progress + radar pulse
  useEffect(() => {
    if (!playing || activeSteps.length < 2 || !map.current) return;

    let frameId: number | null = null;
    const baseSpeed = 0.0007; // tweak for default speed

    const animate = () => {
      // 1) progress
      setProgress((prev) => {
        const next = prev + baseSpeed * speed;
        return next >= 1 ? 1 : next;
      });

      // 2) radar pulse oscillation
      const t = Date.now() / 600;
      const pulse = (Math.sin(t) + 1) / 2; // 0..1

      const src = map.current!.getSource("vehicle") as GeoJSONSource | null;
      if (src && vehicleFeatureRef.current) {
        const current = vehicleFeatureRef.current;
        const updated = {
          ...current,
          properties: {
            ...(current.properties || {}),
            pulse,
          },
        };
        vehicleFeatureRef.current = updated;
        src.setData(updated);
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [playing, speed, activeSteps.length]);

  // Move vehicle along route + camera follow
  useEffect(() => {
    if (!map.current || activeSteps.length < 2) return;

    const totalSegments = activeSteps.length - 1;
    const clamped = Math.max(0, Math.min(1, progress));
    const scaled = clamped * totalSegments;
    const segIndex = Math.min(Math.floor(scaled), totalSegments - 1);
    const t = scaled - segIndex;

    const start = activeSteps[segIndex];
    const end = activeSteps[segIndex + 1];

    const currLng = start.lng + (end.lng - start.lng) * t;
    const currLat = start.lat + (end.lat - start.lat) * t;

    const bearing = turf.bearing(
      turf.point([start.lng, start.lat]),
      turf.point([end.lng, end.lat])
    );

    const color = activeRoute?.color || "#22c55e";

    const src = map.current.getSource("vehicle") as GeoJSONSource | null;
    const newFeature: any = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [currLng, currLat],
      },
      properties: {
        bearing,
        color,
        pulse: vehicleFeatureRef.current?.properties?.pulse ?? 0.5,
      },
    };
    vehicleFeatureRef.current = newFeature;

    if (src) {
      src.setData(newFeature);
    }

    if (cinematicMode) {
      map.current.easeTo({
        center: [currLng, currLat],
        bearing,
        pitch: 45,
        duration: 500,
      });
    }
  }, [progress, activeSteps, activeRoute, cinematicMode]);

  // Auto-fit route when vehicle changes
  useEffect(() => {
    if (!map.current || !mapLoadedRef.current) return;
    const route = activeRoute;
    if (!route || !route.full_path || route.full_path.length < 2) return;

    const coords = route.full_path.map((p) => [p.lng, p.lat] as [number, number]);
    const lons = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    const minLng = Math.min(...lons);
    const maxLng = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    map.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ] as LngLatBoundsLike,
      {
        padding: 80,
        duration: cinematicMode ? 900 : 500,
        pitch: cinematicMode ? 45 : 0,
      }
    );
  }, [vehicleIndex, activeRoute, cinematicMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!hasRoute) return;
        if (progress >= 1) setProgress(0);
        setPlaying((prev) => !prev);
      } else if (e.key === "ArrowRight") {
        if (!routes.length) return;
        setVehicleIndex((prev) => (prev + 1) % routes.length);
      } else if (e.key === "ArrowLeft") {
        if (!routes.length) return;
        setVehicleIndex((prev) => (prev - 1 + routes.length) % routes.length);
      } else if (e.key === "ArrowUp") {
        setSpeed((prev) => Math.min(10, prev + 1));
      } else if (e.key === "ArrowDown") {
        setSpeed((prev) => Math.max(1, prev - 1));
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [routes.length, hasRoute, progress]);

  const handlePlayToggle = () => {
    if (!hasRoute) return;
    if (progress >= 1) {
      setProgress(0);
    }
    setPlaying((p) => !p);
  };

  const handleFocusDepot = () => {
    if (!map.current || activeSteps.length === 0) return;
    const start = activeSteps[0];
    map.current.easeTo({
      center: [start.lng, start.lat],
      zoom: Math.max(map.current.getZoom(), 13),
      duration: 600,
      pitch: cinematicMode ? 45 : 0,
    });
  };

  const handleFocusSelectedNode = () => {
    if (!map.current || !selectedNodeLatLng) return;
    map.current.easeTo({
      center: [selectedNodeLatLng.lng, selectedNodeLatLng.lat],
      zoom: Math.max(map.current.getZoom(), 14),
      duration: 700,
      pitch: cinematicMode ? 45 : 0,
    });
  };

  // ------------------------------------------
  // UI
  // ------------------------------------------
  return (
    <AdminLayout>
      <Head title={`Routes – ${instance.name}`} />

      <div className="relative w-full h-full p-5 lg:p-6">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-950" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.9)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute -top-20 -right-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        {/* HEADER + STATS */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between mb-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 text-[11px] text-slate-300 shadow-sm shadow-slate-900/70 backdrop-blur">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                <span className="font-medium uppercase tracking-wide">VRP Instance</span>
              </span>
              <span className="h-3 w-px bg-slate-700/80" />
              <span className="flex items-center gap-1 text-slate-400">
                <MapIcon className="h-3.5 w-3.5" />
                Brazil test grid
              </span>
              {instance.category && (
                <>
                  <span className="h-3 w-px bg-slate-700/80" />
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-950/90 text-[10px] uppercase tracking-wide border border-slate-700/80">
                    {instance.category}
                  </span>
                </>
              )}
              <span className="h-3 w-px bg-slate-700/80" />
              <span className="px-1.5 py-0.5 rounded-full bg-slate-900/80 text-[10px] border border-slate-800">
                Clarke–Wright · Custom penalties
              </span>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-semibold text-slate-50 tracking-tight flex items-center gap-2">
                {instance.name}
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
                  <Sparkles className="h-3 w-3" />
                  Live route studio
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Cinematic route playback over your custom street graph. Watch each vehicle execute
                its plan in real time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 min-w-[280px] max-w-md">
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2.5 shadow-sm shadow-slate-900/60 transition hover:border-emerald-500/60 hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Vehicles</p>
                <Truck className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <p className="text-lg font-semibold text-slate-50 mt-1">{totalVehicles}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">All assigned & sequenced</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2.5 shadow-sm shadow-slate-900/60 transition hover:border-sky-500/60 hover:shadow-[0_0_18px_rgba(56,189,248,0.35)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Deliveries</p>
                <RouteIcon className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <p className="text-lg font-semibold text-slate-50 mt-1">{totalDeliveries}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across full network</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2.5 shadow-sm shadow-slate-900/60 transition hover:border-fuchsia-500/60 hover:shadow-[0_0_18px_rgba(217,70,239,0.35)]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Total cost</p>
                <Gauge className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <p className="text-lg font-semibold text-slate-50 mt-1">{totalCost.toFixed(0)}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Weighted road penalties</p>
            </div>
          </div>
        </div>

        {/* SECONDARY KPIs BAR */}
        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Avg cost / vehicle
              </p>
              <p className="text-sm font-semibold text-slate-100 mt-1">
                {avgCost.toFixed(1)}
              </p>
            </div>
            <div className="text-[11px] text-slate-500">Route efficiency indicator</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Avg stops / vehicle
              </p>
              <p className="text-sm font-semibold text-slate-100 mt-1">
                {avgStops ? avgStops.toFixed(1) : "—"}
              </p>
            </div>
            <div className="text-[11px] text-slate-500">Load balancing across fleet</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Fleet distance
              </p>
              <p className="text-sm font-semibold text-slate-100 mt-1">
                {fleetDistanceKm ? `${fleetDistanceKm.toFixed(1)} km` : "—"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Timer className="h-3.5 w-3.5" />
              <span>
                {playing ? "Animating" : "Idle"} · {speed}x
              </span>
            </div>
          </div>
        </div>

        {/* Fleet extremes summary */}
        <div className="mb-4 flex flex-wrap gap-2 text-[11px] text-slate-400">
          {fleetExtremes.bestCost && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-emerald-500/40 px-2 py-0.5 text-emerald-200">
              <Sparkles className="h-3 w-3" />
              Best cost: V{fleetExtremes.bestCost.vehicle_number} ·{" "}
              {fleetExtremes.bestCost.cost.toFixed(0)}
            </span>
          )}
          {fleetExtremes.worstCost && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-amber-500/40 px-2 py-0.5 text-amber-200">
              Heaviest cost: V{fleetExtremes.worstCost.vehicle_number} ·{" "}
              {fleetExtremes.worstCost.cost.toFixed(0)}
            </span>
          )}
          {fleetExtremes.longest && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-sky-500/40 px-2 py-0.5 text-sky-200">
              Longest route: V{fleetExtremes.longest.vehicle_number} ·{" "}
              {fleetExtremes.longest.distanceKm.toFixed(1)} km
            </span>
          )}
        </div>

        {/* Cinematic mode + Autoplay toggle */}
        <div className="mb-4 flex justify-end">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700 px-2.5 py-1.5 text-[11px]">
            <span className="text-slate-400">View mode</span>
            <button
              type="button"
              onClick={() => setCinematicMode(false)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition ${
                !cinematicMode
                  ? "bg-slate-800 text-slate-50 shadow-sm"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Simple
            </button>
            <button
              type="button"
              onClick={() => setCinematicMode(true)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition ${
                cinematicMode
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Cinematic
            </button>
            <span className="h-4 w-px bg-slate-700/80 mx-1" />
            <button
              type="button"
              onClick={() => setAutoplayFleet((v) => !v)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] transition ${
                autoplayFleet
                  ? "border-emerald-400/70 bg-emerald-500/15 text-emerald-300"
                  : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500"
              }`}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: autoplayFleet ? "#22c55e" : "#475569",
                }}
              />
              <span>Autoplay fleet</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <div className="w-full lg:w-80 bg-slate-950/90 text-slate-50 p-5 rounded-2xl space-y-5 shadow-xl border border-slate-800/80 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-x-0 -top-10 h-24 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent pointer-events-none" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-700/90">
                    <Truck className="h-3.5 w-3.5 text-emerald-400" />
                  </span>
                  Vehicle Routes
                </h2>
                <span className="text-[11px] text-slate-400">
                  {vehicleIndex + 1} / {totalVehicles}
                </span>
              </div>

              {/* Vehicle selector */}
              <div className="space-y-2 text-sm">
                <label className="block text-[11px] text-slate-400 uppercase tracking-wide">
                  Active vehicle
                </label>
                <select
                  value={vehicleIndex}
                  onChange={(e) => setVehicleIndex(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400/70"
                >
                  {projectedRoutes.map((v, i) => (
                    <option
                      key={`vehicle-option-${v.id ?? v.vehicle_number ?? i}`}
                      value={i}
                    >
                      Vehicle {v.vehicle_number} · {v.deliveries.length} stops
                    </option>
                  ))}
                </select>
              </div>

              {/* Fleet list */}
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                  Fleet overview
                </p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {projectedRoutes.map((v, i) => {
                    const isActive = i === vehicleIndex;
                    const m = routeMetrics[i];
                    const utilization =
                      totalDeliveries > 0
                        ? (v.deliveries.length / totalDeliveries) * 100
                        : 0;

                    return (
                      <button
                        key={`vehicle-row-${v.id ?? v.vehicle_number ?? i}`}
                        type="button"
                        onClick={() => setVehicleIndex(i)}
                        className={`flex items-center justify-between w-full rounded-lg px-2.5 py-1.5 text-xs transition-all duration-150 ${
                          isActive
                            ? "bg-slate-800/95 border border-slate-500/80 shadow-[0_0_18px_rgba(56,189,248,0.35)]"
                            : "bg-slate-900/60 border border-slate-800/80 hover:bg-slate-900/90"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: v.color }}
                          />
                          <span className="font-medium">V{v.vehicle_number}</span>
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-[11px] text-slate-400">
                            {v.deliveries.length} stops ·{" "}
                            {m?.distanceKm ? `${m.distanceKm.toFixed(1)} km` : "—"}
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-900/80 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-sky-400"
                              style={{ width: `${utilization}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex items-center rounded-full bg-slate-900/80 border border-slate-800 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSidebarTab("overview")}
                  className={`flex-1 px-2 py-1 rounded-full transition-all ${
                    sidebarTab === "overview"
                      ? "bg-slate-800 text-slate-50 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab("stops")}
                  className={`flex-1 px-2 py-1 rounded-full transition-all ${
                    sidebarTab === "stops"
                      ? "bg-slate-800 text-slate-50 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Stops & Timeline
                </button>
              </div>

              {activeRoute && sidebarTab === "overview" && (
                <>
                  {/* Active route stats */}
                  <div className="space-y-2 text-xs bg-slate-950/95 border border-slate-800 rounded-xl px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Route cost</span>
                      <span className="font-semibold text-slate-50">
                        {activeRoute.cost.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Stops</span>
                      <span className="font-semibold text-slate-50">
                        {activeRoute.deliveries.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Route length</span>
                      <span className="text-slate-50">
                        {activeDistance.total != null
                          ? `${activeDistance.total.toFixed(2)} km`
                          : activeMetrics?.distanceKm
                          ? `${activeMetrics.distanceKm.toFixed(2)} km`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Remaining</span>
                      <span className="text-slate-50">
                        {activeDistance.remaining != null
                          ? `${Math.max(activeDistance.remaining, 0).toFixed(2)} km`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">ETA @ 30 km/h</span>
                      <span className="text-slate-50">
                        {etaMinutes != null ? `${etaMinutes.toFixed(0)} min` : "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-slate-50">
                        {(progress * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                        style={{ width: `${Math.min(progress * 100, 100)}%` }}
                      />
                    </div>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-slate-400">Route quality</span>
                      <span
                        className={`px-2 py-0.5 rounded-full border text-[10px] ${routeQuality.className}`}
                      >
                        {routeQuality.label}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={handlePlayToggle}
                        disabled={!hasRoute}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                          hasRoute
                            ? "bg-emerald-500/95 hover:bg-emerald-400 text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.4)]"
                            : "bg-slate-800/70 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {playing ? (
                          <>
                            <Pause className="h-3.5 w-3.5" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            Play
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setProgress(0)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl text-sm bg-slate-900/90 hover:bg-slate-900 border border-slate-700 px-3"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Restart</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Speed</span>
                        <span className="text-slate-300">{speed}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full accent-emerald-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Stops view */}
              {activeRoute && sidebarTab === "stops" && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                    Stops (nodes in visit order)
                  </p>
                  <div className="max-h-40 overflow-y-auto pr-1 space-y-1">
                    {activeRoute.deliveries.map((id, idx) => (
                      <div
                        key={`stop-list-${id}-${idx}`}
                        onMouseEnter={() => setHoveredStopId(id)}
                        onMouseLeave={() => setHoveredStopId(null)}
                        onClick={() => setSelectedNodeId(id)}
                        className="flex items-center justify-between text-[11px] rounded-md px-2 py-1 bg-slate-900/80 hover:bg-slate-800/95 border border-slate-800/80 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                            {idx + 1}
                          </span>
                          <span className="text-slate-300">Node {id}</span>
                        </div>
                        <span className="text-slate-500">delivery</span>
                      </div>
                    ))}
                    {activeRoute.deliveries.length === 0 && (
                      <p className="text-[11px] text-slate-500 italic">
                        This vehicle has no assigned stops.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MAP + HUD */}
          <div className="relative flex-1 h-[85vh] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/60 bg-slate-950">
            {/* loading overlay */}
            {!mapReady && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95">
                <div className="flex flex-col items-center gap-2 text-slate-300 text-sm">
                  <div className="h-8 w-8 border-2 border-slate-700 border-t-emerald-400 rounded-full animate-spin" />
                  <span>Initializing route renderer...</span>
                  <span className="text-[10px] text-slate-500">
                    Mapbox · VRP playback engine
                  </span>
                </div>
              </div>
            )}

            {/* vignette */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0,transparent_45%,rgba(15,23,42,0.9)_110%)]" />

            <div ref={mapContainer} className="w-full h-full" />

            {/* top-left HUD */}
            <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-2 z-20">
              <div className="pointer-events-auto rounded-xl bg-slate-900/85 border border-slate-700/80 px-3 py-2 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800">
                      <MapIcon className="h-3.5 w-3.5 text-sky-400" />
                    </span>
                    <div>
                      <p className="text-[11px] font-medium text-slate-100">
                        Playback mode
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Brazil grid · terrain-agnostic
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                        playing
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-800/80 text-slate-300 border border-slate-600/80"
                      }`}
                    >
                      {playing ? "Playing" : "Paused"}
                    </span>
                    <button
                      type="button"
                      onClick={handleFocusDepot}
                      className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-100 hover:bg-slate-700"
                    >
                      Focus depot
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* top-right LEGEND + active vehicle */}
            <div className="pointer-events-none absolute top-3 right-3 flex flex-col items-end gap-2 z-20">
              <div className="pointer-events-auto rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 shadow-lg backdrop-blur-sm">
                <p className="text-[11px] text-slate-400 mb-1">Legend</p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="h-1.5 w-4 rounded-full bg-slate-500/70" />
                    <span>Route (all)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="h-1.5 w-4 rounded-full bg-emerald-400" />
                    <span>Route (active)</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-amber-300" />
                    <span>Delivery</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Active stops</span>
                  </div>
                </div>
              </div>

              {activeRoute && (
                <div className="pointer-events-auto rounded-full bg-slate-900/85 border border-slate-700/80 px-3 py-1.5 flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: activeRoute.color }}
                  />
                  <span className="text-xs text-slate-100 font-medium">
                    Vehicle {activeRoute.vehicle_number}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {activeRoute.deliveries.length} stops ·{" "}
                    {activeRoute.cost.toFixed(0)} cost
                  </span>
                </div>
              )}
            </div>

            {/* Node inspector bottom-left */}
            {selectedNode && selectedNodeLatLng && (
              <div className="pointer-events-none absolute bottom-4 left-3 z-20">
                <div className="pointer-events-auto rounded-xl bg-slate-900/90 border border-slate-700 px-3 py-2.5 shadow-lg backdrop-blur-md max-w-xs text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-100">
                      Node {selectedNode.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedNodeId(null)}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Coordinates:{" "}
                    <span className="text-slate-200">
                      {selectedNodeLatLng.lat.toFixed(5)}°,{" "}
                      {selectedNodeLatLng.lng.toFixed(5)}°
                    </span>
                  </p>
                  {selectedNodeIndexInRoute >= 0 && (
                    <p className="text-[11px] text-slate-400">
                      Part of vehicle{" "}
                      <span className="text-slate-200">
                        {activeRoute?.vehicle_number}
                      </span>
                      , stop{" "}
                      <span className="text-slate-200">
                        {selectedNodeIndexInRoute + 1} / {stopsCount}
                      </span>
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleFocusSelectedNode}
                      className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-100 hover:bg-slate-700"
                    >
                      Focus node
                    </button>
                    <span className="text-[10px] text-slate-500">
                      Click any node on map to update
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* bottom timeline HUD */}
            <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center z-20">
              <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-slate-900/85 border border-slate-700/70 px-4 py-3 shadow-xl backdrop-blur-md max-w-xl w-[90%]">
                <button
                  onClick={handlePlayToggle}
                  disabled={!hasRoute}
                  className={`inline-flex items-center justify-center h-9 w-9 rounded-full border text-slate-50 shadow-md transition-all duration-150 ${
                    hasRoute
                      ? "border-emerald-400/70 bg-emerald-500/95 hover:bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.5)]"
                      : "border-slate-700 bg-slate-800/80 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Route playback</span>
                    <span className="text-slate-300">
                      {(progress * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* quick jump controls */}
                  <div className="flex items-center justify-end gap-2 text-[10px] text-slate-500 mb-0.5">
                    <button
                      className="px-1.5 py-0.5 rounded-full hover:bg-slate-800 text-slate-300"
                      onClick={() => setProgress(0)}
                    >
                      Start
                    </button>
                    <button
                      className="px-1.5 py-0.5 rounded-full hover:bg-slate-800 text-slate-300"
                      onClick={() => setProgress(0.5)}
                    >
                      Mid
                    </button>
                    <button
                      className="px-1.5 py-0.5 rounded-full hover:bg-slate-800 text-slate-300"
                      onClick={() => setProgress(1)}
                    >
                      End
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.001"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      className="w-full accent-emerald-400"
                    />
                    {/* glowing playhead */}
                    <div
                      className="pointer-events-none absolute top-1/2 -mt-[5px] h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                      style={{
                        left: `${progress * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>

                  {/* stop segments bar */}
                  {stopsCount > 0 && (
                    <div className="mt-1 flex gap-0.5">
                      {activeRoute?.deliveries.map((id, idx) => (
                        <div
                          key={`stop-bar-${id}-${idx}`}
                          className={`h-1 rounded-full transition-all ${
                            idx < currentStopIdx
                              ? "bg-emerald-400"
                              : idx === currentStopIdx
                              ? "bg-emerald-300"
                              : "bg-slate-700"
                          }`}
                          title={`Stop ${idx + 1} · Node ${id}`}
                          style={{ flex: 1 }}
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500">
                    Drag the timeline to scrub the route. Speed:
                    <span className="ml-1 text-slate-300">{speed}x</span>
                    {stopsCount > 0 && (
                      <>
                        {" · Stop "}
                        <span className="text-slate-300">
                          {currentStopIdx + 1} / {stopsCount}
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                      playing
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800/80 text-slate-300 border border-slate-600/80"
                    }`}
                  >
                    {playing ? "Playing" : "Paused"}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {activeRoute?.deliveries.length ?? 0} stops in route · Space = play/pause ·
                    Autoplay {autoplayFleet ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}