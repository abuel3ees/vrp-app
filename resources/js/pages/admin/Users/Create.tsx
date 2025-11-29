"use client";

import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function CreateUser() {
    const form = useForm({
        first_name: "",
        last_name: "",
        email: "",
        bio: "",
        role: "user",
        status: true,
        password: "",
    });

    function submit(e: any) {
        e.preventDefault();
        form.post("/admin/users");
    }

    return (
        <AdminLayout title="Create User">
            <section className="container mx-auto py-16 max-w-2xl">
                <Card className="w-full p-6 lg:p-8">

                    <div className="mb-6">
                        <h3 className="text-2xl font-semibold">Create User</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Create a new user account and assign permissions.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                            <div className="bg-primary/10 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold">
                                ??
                            </div>
                            <div className="text-center sm:text-left">
                                <Button variant="outline" size="sm">Upload Picture</Button>
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
                                    placeholder="e.g. John"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    value={form.data.last_name}
                                    onChange={(e) => form.setData("last_name", e.target.value)}
                                    placeholder="e.g. Doe"
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
                                placeholder="e.g. john@example.com"
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
                                    Enable or disable this user
                                </p>
                            </div>
                            <Switch
                                checked={form.data.status}
                                onCheckedChange={(val) => form.setData("status", val)}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData("password", e.target.value)}
                                placeholder="********"
                            />
                        </div>

                        <Button type="submit" className="w-full">Create User</Button>

                    </form>
                </Card>
            </section>
        </AdminLayout>
    );
}