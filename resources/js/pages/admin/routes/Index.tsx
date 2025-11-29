"use client";

import { useState } from "react";
import { usePage, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";

import { Search, Filter, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function RoutesIndex() {
  const { routes, vehicles, filters } = usePage().props;

  const [selected, setSelected] = useState<number[]>([]);

  // Bulk selection
  const toggleRow = (id: number) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === routes.data.length
        ? []
        : routes.data.map((item) => item.id)
    );
  };

  // Filters
  const search = filters?.search || "";
  const vehicle_id = filters?.vehicle_id || "";

  function handleSearch(e: any) {
    router.get(
      "/admin/routes",
      { ...filters, search: e.target.value },
      { preserveState: true, replace: true }
    );
  }

  function handleVehicleFilter(value: string) {
    router.get(
      "/admin/routes",
      { ...filters, vehicle_id: value === "all" ? null : value },
      { preserveState: true, replace: true }
    );
  }

  return (
    <AdminLayout title="Routes">
      <div className="mx-auto pt-4 pb-8 px-4 lg:px-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Routes</h1>
          <p className="text-muted-foreground">
            Manage all routes, vehicles, and delivery sequences
          </p>
        </div>

        <Card className="p-6">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search routes..."
                className="pl-10"
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Vehicle filter */}
            <Select
              defaultValue={vehicle_id || "all"}
              onValueChange={handleVehicleFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by vehicle" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.plate_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => router.get("/admin/routes/create")}>
              + Create Route
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>

                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.length === routes.data.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>

                  <TableHead>ID</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Total Distance</TableHead>
                  <TableHead>Total Time</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-12"></TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>
                {routes.data.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(route.id)}
                        onCheckedChange={() => toggleRow(route.id)}
                      />
                    </TableCell>

                    <TableCell>{route.id}</TableCell>

                    <TableCell>
                      {route.vehicle?.plate_number ?? "N/A"}
                    </TableCell>

                    <TableCell>{route.deliveries?.length}</TableCell>

                    <TableCell>
                      {route.total_distance ?? "—"}
                    </TableCell>

                    <TableCell>
                      {route.total_time ?? "—"}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {route.created_at}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.get(`/admin/routes/${route.id}`)
                            }
                          >
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              router.get(`/admin/routes/${route.id}/edit`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("Delete this route?")) {
                                router.delete(`/admin/routes/${route.id}`);
                              }
                            }}
                          >
                            Delete
                          </DropdownMenuItem>

                        </DropdownMenuContent>

                      </DropdownMenu>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {routes.current_page} of {routes.last_page}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!routes.prev_page_url}
                onClick={() => router.get(routes.prev_page_url)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!routes.next_page_url}
                onClick={() => router.get(routes.next_page_url)}
              >
                Next
              </Button>
            </div>
          </div>

        </Card>
      </div>
    </AdminLayout>
  );
}