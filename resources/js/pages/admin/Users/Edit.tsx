"use client";

import { useForm, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function EditUser() {
    const { user } = usePage().props;

    const form = useForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        bio: user.bio ?? "",
        role: user.role ?? "user",
        status: user.status ?? true,
        password: "",
    });

    function submit(e: any) {
        e.preventDefault();
        form.put(`/admin/users/${user.id}`);
    }

    function deleteUser() {
        if (confirm("Are you sure?")) {
            router.delete(`/admin/users/${user.id}`);
        }
    }

    return (
        <AdminLayout title="Edit User">
            <section className="container mx-auto py-16 max-w-2xl">
                <Card className="w-full p-6 lg:p-8">

                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold">Edit Profile</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Manage user profile information, role, and status.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                            <div className="bg-primary/10 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold">
                                {user.first_name.charAt(0)}
                                {user.last_name.charAt(0)}
                            </div>
                            <div className="text-center sm:text-left">
                                <Button variant="outline" size="sm">Change Picture</Button>
                                <p className="text-muted-foreground mt-2 text-xs">
                                    JPG, GIF or PNG. Max size of 800K
                                </p>
                            </div>
                        </div>

                        {/* First + Last Name */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>First Name</Label>
                                <Input
                                    value={form.data.first_name}
                                    onChange={(e) => form.setData("first_name", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData("last_name", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData("email", e.target.value)}
                            />
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label>Bio</Label>
                            <Textarea
                                rows={4}
                                value={form.data.bio}
                                onChange={(e) => form.setData("bio", e.target.value)}
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={form.data.role}
                                onValueChange={(val) => form.setData("role", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="guest">Guest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Account Status</Label>
                                <p className="text-muted-foreground text-sm">
                                    Enable or disable this account
                                </p>
                            </div>
                            <Switch
                                checked={form.data.status}
                                onCheckedChange={(val) => form.setData("status", val)}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label>New Password (optional)</Label>
                            <Input
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData("password", e.target.value)}
                                placeholder="Leave empty to keep current password"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <Button type="submit" className="flex-1">
                                Save Changes
                            </Button>

                            <Button
                                type="button"
                                className="flex-1"
                                variant="destructive"
                                onClick={deleteUser}
                            >
                                Delete User
                            </Button>
                        </div>

                    </form>
                </Card>
            </section>
        </AdminLayout>
    );
}