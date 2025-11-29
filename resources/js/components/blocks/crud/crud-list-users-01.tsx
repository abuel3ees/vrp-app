"use client";

import { useState } from "react";
import { usePage, router } from "@inertiajs/react";

import AdminLayout from "@/Layouts/AdminLayout";

import { MoreHorizontal, Search, Filter, UserPlus, Download } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function UsersIndex() {
  const { users, filters } = usePage().props;

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Bulk selection
  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAll = () => {
    setSelectedUsers(
      selectedUsers.length === users.data.length
        ? []
        : users.data.map((u) => u.id)
    );
  };

  // Search
  const search = filters?.search || "";
  function handleSearch(e: any) {
    router.get(
      "/admin/users",
      { search: e.target.value },
      { preserveState: true, replace: true }
    );
  }

  return (
    <AdminLayout title="Users">
      <div className="mx-auto py-8 px-4 lg:px-8 max-w-5xl w-full">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">
            Manage your team members and their account permissions
          </p>
        </div>

        <Card className="p-6">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-10"
                onChange={handleSearch}
                value={search}
              />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => router.get("/users/create")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-muted p-3 rounded-md mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedUsers.length} user
                {selectedUsers.length !== 1 ? "s" : ""} selected
              </span>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">Change Role</Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedUsers.length === users.data.length &&
                        selectedUsers.length > 0
                      }
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>

                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                    </TableCell>

                    {/* User Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar ?? ""} />
                          <AvatarFallback>
                            {user.first_name?.charAt(0) ?? "?"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant={user.status ? "default" : "secondary"}>
                        {user.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Created */}
                    <TableCell className="text-muted-foreground text-sm">
                      {user.created_at}
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() => router.get(`/admin/users/${user.id}`)}
                          >
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => router.get(`/admin/users/${user.id}/edit`)}
                          >
                            Edit User
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              if (confirm("Delete this user?")) {
                                router.delete(`/admin/users/${user.id}`);
                              }
                            }}
                          >
                            Delete User
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
              Page {users.current_page} of {users.last_page}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!users.prev_page_url}
                onClick={() =>
                  router.get(users.prev_page_url, {}, { preserveState: true })
                }
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!users.next_page_url}
                onClick={() =>
                  router.get(users.next_page_url, {}, { preserveState: true })
                }
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