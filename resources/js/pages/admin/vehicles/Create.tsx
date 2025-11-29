"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
export default function CreateVehicle() {
  const { drivers } = usePage().props;

  function submit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    router.post("/admin/vehicles", form);
  }

  return (
    <AdminLayout title="Create Vehicle">
    <section className="container mx-auto py-16 max-w-2xl">
      <Card className="w-full p-6 lg:p-8">

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Create Vehicle</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Register a new vehicle and optionally assign a driver.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">

          {/* DRIVER */}
          <div className="space-y-2">
            <Label>Assigned Driver (Optional)</Label>
            <Select name="driver_id" defaultValue="">
              <SelectTrigger>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Driver</SelectItem>
                {drivers.map((d: any) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PLATE NUMBER */}
          <div className="space-y-2">
            <Label>Plate Number</Label>
            <Input name="plate_number" required />
          </div>

          {/* MODEL */}
          <div className="space-y-2">
            <Label>Model</Label>
            <Input name="model" placeholder="e.g. Toyota Hilux" />
          </div>

          {/* CAPACITY */}
          <div className="space-y-2">
            <Label>Capacity (kg)</Label>
            <Input type="number" name="capacity" required />
          </div>

          <Button type="submit" className="w-full">Create Vehicle</Button>

        </form>
      </Card>
    </section>
    </AdminLayout>
  );
}