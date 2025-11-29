"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/Layouts/AdminLayout";
import { router } from "@inertiajs/react";

export default function CreateDelivery() {
  function submit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    router.post("/admin/deliveries", form);
  }

  return (
    <AdminLayout title="Create Delivery">
    <section className="container mx-auto py-16 max-w-2xl">
      <Card className="w-full p-6 lg:p-8">

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Create Delivery</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Add a new delivery order with customer and location details.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">

          {/* CUSTOMER NAME */}
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input name="customer_name" placeholder="e.g. John Doe" required />
          </div>

          {/* ADDRESS */}
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea name="address" placeholder="Delivery address..." required rows={2} />
          </div>

          {/* LAT + LNG */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input type="number" step="any" name="lat" required />
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input type="number" step="any" name="lng" required />
            </div>
          </div>

          {/* DEADLINE */}
          <div className="space-y-2">
            <Label>Deadline (Optional)</Label>
            <Input type="datetime-local" name="deadline" />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select name="status" defaultValue="pending">
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* BUTTON */}
          <Button type="submit" className="w-full">Create Delivery</Button>

        </form>
      </Card>
    </section>
    </AdminLayout>
  );
}