"use client";

import { useMemo, useState } from "react";
import { usePage, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";

import {
  Search,
  MoreHorizontal,
  Filter,
  Trash2,
  Plus,
  ArrowUpDown,
} from "lucide-react";

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
    category?: string;
    sort?: string;
    per_page?: number;
  };
}

export default function InstancesIndex() {
  const { instances, filters } = usePage<PageProps>().props;

  const [selected, setSelected] = useState<number[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // --------------------------
  // Helpers
  // --------------------------
  const search = filters?.search || "";
  const category = filters?.category || "all";
  const sort = filters?.sort || "created_desc";
  const perPage = filters?.per_page || 10;

  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    instances.data.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set);
  }, [instances.data]);

  const allIds = useMemo(
    () => instances.data.map((i) => i.id),
    [instances.data]
  );

  const allSelected =
    selected.length > 0 && selected.length === instances.data.length;
  const partiallySelected =
    selected.length > 0 && selected.length < instances.data.length;

  const updateFilters = (partial: Partial<PageProps["filters"]>) => {
    router.get(
      "/admin/instances",
      {
        ...filters,
        ...partial,
      },
      {
        preserveState: true,
        replace: true,
        preserveScroll: true,
      }
    );
  };

  // --------------------------
  // Bulk selection
  // --------------------------
  const toggleRow = (id: number) => {
    setSelected((curr) =>
      curr.includes(id) ? curr.filter((s) => s !== id) : [...curr, id]
    );
  };

  const toggleAll = () => {
    setSelected((curr) =>
      curr.length === instances.data.length ? [] : [...allIds]
    );
  };

  // --------------------------
  // Search & filters
  // --------------------------
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    updateFilters({ search: e.target.value, page: 1 as any });
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateFilters({ category: e.target.value === "all" ? undefined : e.target.value, page: 1 as any });
  }

  function handleSortChange(value: string) {
    updateFilters({ sort: value, page: 1 as any });
  }

  function handlePerPageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = Number(e.target.value) || 10;
    updateFilters({ per_page: value, page: 1 as any });
  }

  // --------------------------
  // Delete actions
  // --------------------------
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this instance?")) return;

    router.delete(`/admin/instances/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setSelected((curr) => curr.filter((s) => s !== id));
      },
    });
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (
      !confirm(
        `Delete ${selected.length} selected instance(s)? This action cannot be undone.`
      )
    )
      return;

    setIsBulkDeleting(true);

    // naive bulk delete: one request per id (simple + backend-agnostic)
    selected.forEach((id) => {
      router.delete(`/admin/instances/${id}`, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => {
          setSelected((curr) => curr.filter((s) => s !== id));
          setIsBulkDeleting(false);
        },
      });
    });
  };

  // --------------------------
  // Pagination
  // --------------------------
  const goToUrl = (url: string | null) => {
    if (!url) return;
    router.get(url, {}, { preserveState: true, preserveScroll: true });
  };

  return (
    <AdminLayout title="VRP Instances">
      <div className="mx-auto pt-4 pb-8 px-4 lg:px-8 max-w-6xl w-full">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight">
              VRP Instances
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage all benchmark VRP instances, tweak filters, and run
              optimizations on demand.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => router.get("/admin/instances/create")}
            >
              <Plus className="h-4 w-4 mr-1" />
              New instance
            </Button>
          </div>
        </div>

        <Card className="p-4 md:p-6 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Left: search + filters */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by instance name or category..."
                  className="pl-10"
                  value={search}
                  onChange={handleSearch}
                />
              </div>

              {/* Category filter */}
              <div className="flex items-center gap-2">
                <Filter className="hidden sm:block h-4 w-4 text-muted-foreground" />
                <select
                  className="h-9 rounded-md border border-input bg-background px-2 text-xs sm:text-sm text-foreground"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="all">All categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right: sort + per-page */}
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleSortChange("created_desc")}
                  >
                    Newest first
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("created_asc")}
                  >
                    Oldest first
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("deliveries_desc")}
                  >
                    Most deliveries
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("deliveries_asc")}
                  >
                    Fewest deliveries
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Per-page */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="hidden sm:inline">Rows:</span>
                <select
                  className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                  value={perPage}
                  onChange={handlePerPageChange}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bulk actions strip */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              {selected.length > 0 ? (
                <span>
                  <span className="font-medium text-foreground">
                    {selected.length}
                  </span>{" "}
                  selected.
                </span>
              ) : (
                <span>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {instances.data.length}
                  </span>{" "}
                  instance(s).
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
                disabled={selected.length === 0 || isBulkDeleting}
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                <span>Delete selected</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={
                        allSelected ? true : partiallySelected ? "indeterminate" : false
                      }
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                    />
                  </TableHead>

                  <TableHead className="w-14">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Deliveries</TableHead>
                  <TableHead className="text-right">Vehicles</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {instances.data.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No instances found. Try changing your filters or add a new
                      one.
                    </TableCell>
                  </TableRow>
                )}

                {instances.data.map((inst) => {
                  const isRowSelected = selected.includes(inst.id);

                  return (
                    <TableRow
                      key={inst.id}
                      className={isRowSelected ? "bg-muted/40" : undefined}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isRowSelected}
                          onCheckedChange={() => toggleRow(inst.id)}
                          aria-label={`Select instance ${inst.id}`}
                        />
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        #{inst.id}
                      </TableCell>

                      <TableCell className="font-medium">
                        {inst.name}
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                          {inst.category || "Uncategorized"}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        {inst.delivery_points}
                      </TableCell>

                      <TableCell className="text-right">
                        {inst.number_of_vehicles}
                      </TableCell>

                      <TableCell className="text-sm text-muted-foreground">
                        {inst.created_at}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.get(`/admin/instances/${inst.id}`)
                              }
                            >
                              View details
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(inst.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <p>
              Page{" "}
              <span className="font-medium text-foreground">
                {instances.current_page}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {instances.last_page}
              </span>
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!instances.prev_page_url}
                onClick={() => goToUrl(instances.prev_page_url)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!instances.next_page_url}
                onClick={() => goToUrl(instances.next_page_url)}
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