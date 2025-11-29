"use client";

import { useState } from "react";
import { usePage, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";

import {
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";

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

export default function DeliveriesIndex() {
  const { deliveries, filters } = usePage().props;

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
      selected.length === deliveries.data.length
        ? []
        : deliveries.data.map((item) => item.id)
    );
  };

  // Search filter
  const search = filters?.search || "";
  function handleSearch(e: any) {
    router.get(
      "/admin/deliveries",
      { ...filters, search: e.target.value },
      { preserveState: true, replace: true }
    );
  }

  // Status filter
  const status = filters?.status || "";
  function handleStatusFilter(value: string) {
    router.get(
      "/admin/deliveries",
      {
        ...filters,
        status: value === "all" ? null : value,
      },
      { preserveState: true, replace: true }
    );
  }

  return (
    <AdminLayout title="Deliveries">
      <div className="mx-auto pt-4 pb-8 px-4 lg:px-8 max-w-6xl w-full">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Deliveries</h1>
          <p className="text-muted-foreground">
            Track delivery assignments, deadlines, and statuses.
          </p>
        </div>

        <Card className="p-6">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">

            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or address..."
                className="pl-10"
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Status Filter */}
            <Select
              defaultValue={status || "all"}
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => router.get("/admin/deliveries/create")}>
              + New Delivery
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>

                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.length === deliveries.data.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>

                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-12"></TableHead>

                </TableRow>
              </TableHeader>

              <TableBody>
                {deliveries.data.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(d.id)}
                        onCheckedChange={() => toggleRow(d.id)}
                      />
                    </TableCell>

                    <TableCell>{d.id}</TableCell>

                    <TableCell>{d.customer_name}</TableCell>

                    <TableCell>{d.address}</TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {d.deadline || "—"}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <span
                        className={
                          d.status === "completed"
                            ? "text-green-600 font-semibold"
                            : d.status === "assigned"
                            ? "text-blue-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {d.status}
                      </span>
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
                              router.get(`/admin/deliveries/${d.id}`)
                            }
                          >
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              router.get(`/admin/deliveries/${d.id}/edit`)
                            }
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("Delete this delivery?")) {
                                router.delete(`/admin/deliveries/${d.id}`);
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
              Page {deliveries.current_page} of {deliveries.last_page}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!deliveries.prev_page_url}
                onClick={() => router.get(deliveries.prev_page_url)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!deliveries.next_page_url}
                onClick={() => router.get(deliveries.next_page_url)}
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