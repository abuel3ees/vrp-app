"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/dropdown-menu";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?: "text" | "badge" | "status" | "date";
}

interface SimpleTableProps {
  title: string;
  description?: string;
  rows: any[];
  columns: Column[];

  onEdit?: (id: number) => void;
  onShow?: (id: number) => void;
  onDelete?: (id: number) => void;

  rowKey?: string;
}

export default function DataTableSimple({
  title,
  description,
  rows,
  columns,
  onEdit,
  onShow,
  onDelete,
  rowKey = "id",
}: SimpleTableProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState(columns[0].key);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // FILTER rows based on search
  const filteredRows = rows.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SORT rows
  const sortedRows = [...filteredRows].sort((a, b) => {
    const col = sortColumn;
    const valA = a[col];
    const valB = b[col];

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const toggleAll = () => {
    setSelected(
      selected.length === sortedRows.length
        ? []
        : sortedRows.map((d) => d[rowKey])
    );
  };

  const toggleRow = (id: number) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  const handleSort = (column: string) => {
    if (sortColumn === column)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const formatValue = (value: any, type?: string) => {
    if (!type) return value;

    switch (type) {
      case "badge":
        return <Badge variant="outline">{value}</Badge>;

      case "status":
        return (
          <Badge
            variant={
              value === "active"
                ? "default"
                : value === "pending"
                ? "secondary"
                : "outline"
            }
          >
            {value}
          </Badge>
        );

      case "date":
        return <span className="text-muted-foreground">{value}</span>;

      default:
        return value;
    }
  };

  return (
    <div className="container mx-auto py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>
              {title} ({rows.length})
            </CardTitle>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {selected.length > 0 && (
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete ({selected.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selected.length === sortedRows.length}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>

                  {columns.map((col) => (
                    <TableHead key={col.key}>
                      <button
                        className="flex items-center gap-2 hover:text-foreground"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                        {sortColumn === col.key &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </button>
                    </TableHead>
                  ))}

                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedRows.map((item) => (
                  <TableRow key={item[rowKey]}>
                    <TableCell>
                      <Checkbox
                        checked={selected.includes(item[rowKey])}
                        onCheckedChange={() => toggleRow(item[rowKey])}
                      />
                    </TableCell>

                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {formatValue(item[col.key], col.type)}
                      </TableCell>
                    ))}

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(item[rowKey])}
                            >
                              Edit
                            </DropdownMenuItem>
                          )}

                          {onShow && (
                            <DropdownMenuItem
                              onClick={() => onShow(item[rowKey])}
                            >
                              View Details
                            </DropdownMenuItem>
                          )}

                          {onDelete && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDelete(item[rowKey])}
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}