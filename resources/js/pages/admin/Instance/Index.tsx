"use client";

import { useState } from "react";
import { usePage, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";

import { Search, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

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

interface Instance {
  id: number;
  name: string;
  category: string;
  delivery_points: number;
  number_of_vehicles: number;
  created_at: string;
}

interface PageProps {
  instances: {
    data: Instance[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
  };
  filters: {
    search?: string;
  };
}

export default function InstancesIndex() {
  const { instances, filters } = usePage<PageProps>().props;

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
      selected.length === instances.data.length
        ? []
        : instances.data.map((i) => i.id)
    );
  };

  // --------------------------
  // Search by name/category
  // --------------------------
  const search = filters?.search || "";

  function handleSearch(e: any) {
    router.get(
      "/admin/instances",
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
    <AdminLayout title="VRP Instances">
      <div className="mx-auto pt-4 pb-8 px-4 lg:px-8 max-w-6xl w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">VRP Instances</h1>
          <p className="text-muted-foreground">
            Manage all benchmark VRP instances and run optimizations.
          </p>
        </div>

        <Card className="p-6">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search instances by name or category..."
                className="pl-10"
                value={search}
                onChange={handleSearch}
              />
            </div>

          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.length === instances.data.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>

                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Vehicles</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-12"></TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>
                {instances.data.map((inst) => (
                  <TableRow key={inst.id}>
                    
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(inst.id)}
                        onCheckedChange={() => toggleRow(inst.id)}
                      />
                    </TableCell>

                    <TableCell>{inst.id}</TableCell>

                    <TableCell className="font-medium">
                      {inst.name}
                    </TableCell>

                    <TableCell>{inst.category}</TableCell>

                    <TableCell>{inst.delivery_points}</TableCell>

                    <TableCell>{inst.number_of_vehicles}</TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {inst.created_at}
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
                              router.get(`/admin/instances/${inst.id}`)
                            }
                          >
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              alert("Instances cannot be deleted.");
                            }}
                          >
                            Delete (Disabled)
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
              Page {instances.current_page} of {instances.last_page}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!instances.prev_page_url}
                onClick={() => router.get(instances.prev_page_url!)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!instances.next_page_url}
                onClick={() => router.get(instances.next_page_url!)}
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