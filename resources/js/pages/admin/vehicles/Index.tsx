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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VehiclesIndex() {
  const { vehicles, filters, drivers } = usePage().props;

  const [selected, setSelected] = useState<number[]>([]);

  // Bulk select
  const toggleRow = (id: number) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === vehicles.data.length
        ? []
        : vehicles.data.map((v) => v.id)
    );
  };

  // Search fields: plate_number + model
  const search = filters?.search || "";
  function handleSearch(e: any) {
    router.get(
      "/admin/vehicles",
      { ...filters, search: e.target.value },
      { preserveState: true, replace: true }
    );
  }

  // Driver filter
  const driver_id = filters?.driver_id || "";
  function handleDriverFilter(value: string) {
    router.get(
      "/admin/vehicles",
      { ...filters, driver_id: value === "all" ? null : value },
      { preserveState: true, replace: true }
    );
  }

  return (
    <AdminLayout title="Vehicles">
      <div className="mx-auto pt-4 pb-8 px-4 lg:px-8 max-w-6xl w-full">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage all fleet vehicles, driver assignments, and capacity data.
          </p>
        </div>

        <Card className="p-6">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by plate number or model..."
                className="pl-10"
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Driver filter */}
            <Select
              defaultValue={driver_id || "all"}
              onValueChange={handleDriverFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by driver" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Drivers</SelectItem>
                {drivers.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => router.get("/admin/vehicles/create")}>
              + New Vehicle
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>

                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.length === vehicles.data.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>

                  <TableHead>ID</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-12"></TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>
                {vehicles.data.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(v.id)}
                        onCheckedChange={() => toggleRow(v.id)}
                      />
                    </TableCell>

                    <TableCell>{v.id}</TableCell>

                    <TableCell>{v.plate_number}</TableCell>

                    <TableCell>{v.model || "—"}</TableCell>

                    <TableCell>{v.capacity}</TableCell>

                    <TableCell>
                      {v.driver ? v.driver.name : "Unassigned"}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {v.created_at}
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
                              router.get(`/admin/vehicles/${v.id}`)
                            }
                          >
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              router.get(`/admin/vehicles/${v.id}/edit`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("Delete this vehicle?")) {
                                router.delete(`/admin/vehicles/${v.id}`);
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
              Page {vehicles.current_page} of {vehicles.last_page}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!vehicles.prev_page_url}
                onClick={() => router.get(vehicles.prev_page_url)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!vehicles.next_page_url}
                onClick={() => router.get(vehicles.next_page_url)}
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
