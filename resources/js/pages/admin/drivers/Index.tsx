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

export default function DriversIndex() {
  const { drivers, filters } = usePage().props;

  const [selected, setSelected] = useState<number[]>([]);

  // --------------------------
  // Bulk selection
  // --------------------------
  const toggleRow = (id: number) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  const toggleAll = () => {
    setSelected(
      selected.length === drivers.data.length
        ? []
        : drivers.data.map((d) => d.id)
    );
  };

  // --------------------------
  // Search (name, phone, email)
  // --------------------------
  const search = filters?.search || "";

  function handleSearch(e: any) {
    router.get(
      "/admin/drivers",
      {
        ...filters,
        search: e.target.value,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  }

  return (
    <AdminLayout title="Drivers">
      <div className="mx-auto pt-4 pb-8 px-4 lg:px-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Drivers</h1>
          <p className="text-muted-foreground">
            Manage all delivery drivers, contact information, and assignments.
          </p>
        </div>

        <Card className="p-6">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers by name, phone, or email..."
                className="pl-10"
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Create */}
            <Button onClick={() => router.get("/admin/drivers/create")}>
              + New Driver
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.length === drivers.data.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>

                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-12"></TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>
                {drivers.data.map((d) => (
                  <TableRow key={d.id}>
                    
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(d.id)}
                        onCheckedChange={() => toggleRow(d.id)}
                      />
                    </TableCell>

                    <TableCell>{d.id}</TableCell>

                    <TableCell className="font-medium">{d.name}</TableCell>

                    <TableCell>{d.phone || "—"}</TableCell>

                    <TableCell className="text-muted-foreground">
                      {d.email || "—"}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {d.created_at}
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
                              router.get(`/admin/drivers/${d.id}`)
                            }
                          >
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              router.get(`/admin/drivers/${d.id}/edit`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("Delete this driver?")) {
                                router.delete(`/admin/drivers/${d.id}`);
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
              Page {drivers.current_page} of {drivers.last_page}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!drivers.prev_page_url}
                onClick={() => router.get(drivers.prev_page_url)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!drivers.next_page_url}
                onClick={() => router.get(drivers.next_page_url)}
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