"use client";

import { ArrowLeft, Edit, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import { usePage, router } from "@inertiajs/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/Layouts/AdminLayout";

export default function UserShow() {
  const { user } = usePage().props;

  function deleteUser() {
    if (confirm("Are you sure you want to delete this user?")) {
      router.delete(`/admin/users/${user.id}`);
    }
  }

  return (
    <AdminLayout title={`User: ${user.first_name} ${user.last_name}`}>
    <div className="container mx-auto py-16 max-w-6xl">

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => router.get("/admin/users")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Users
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar ?? ""} />
            <AvatarFallback>
              {user.first_name.charAt(0)}
              {user.last_name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {user.first_name} {user.last_name}
              </h1>

              <Badge variant={user.status ? "default" : "secondary"}>
                {user.status ? "Active" : "Inactive"}
              </Badge>
            </div>

            <p className="text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex gap-2">
          <Button onClick={() => router.get(`/admin/users/${user.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive"
                onClick={deleteUser}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">

        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">

          <div className="grid gap-6 lg:grid-cols-3">

            {/* Main Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">

                {/* Bio */}
                <div>
                  <p className="text-sm font-medium mb-2">Bio</p>
                  <p className="text-muted-foreground text-sm">
                    {user.bio || "No bio available"}
                  </p>
                </div>

                <Separator />

                {/* Role / Status */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Role</p>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Status</p>
                    <Badge variant={user.status ? "default" : "secondary"}>
                      {user.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Email */}
                <div>
                  <p className="text-sm font-medium mb-1">Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

              </CardContent>
            </Card>

            {/* Metadata Column */}
            <div className="space-y-6">

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Metadata</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">

                  <div>
                    <p className="text-muted-foreground mb-1">Created</p>
                    <p className="font-medium">{user.created_at}</p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-muted-foreground mb-1">Last Updated</p>
                    <p className="font-medium">
                      {user.updated_at ?? "N/A"}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-muted-foreground mb-1">User ID</p>
                    <p className="font-mono text-xs">user_{user.id}</p>
                  </div>

                </CardContent>
              </Card>

            </div>
          </div>

        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground text-sm">
                (You can integrate real activity logs here later.)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings (placeholder) */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
            </CardHeader>

            <CardContent className="text-muted-foreground text-sm">
              Settings options coming soon...
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
    </AdminLayout>
  );
}