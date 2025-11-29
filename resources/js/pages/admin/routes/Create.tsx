"use client";

import { useState } from "react";
import { usePage, router } from "@inertiajs/react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AdminLayout from "@/Layouts/AdminLayout";

export default function RouteCreate() {
  const { vehicles, deliveries } = usePage().props;

  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [items, setItems] = useState<{ id: number; sequence: number }[]>([]);

  // Add delivery row
  function addDelivery() {
    setItems([
      ...items,
      { id: deliveries[0]?.id ?? 0, sequence: items.length + 1 },
    ]);
  }

  // Remove delivery row
  function removeDelivery(i: number) {
    const updated = [...items];
    updated.splice(i, 1);
    setItems(updated);
  }

  // Submit form
  function handleSubmit(e: any) {
    e.preventDefault();

    router.post("/admin/routes", {
      vehicle_id: selectedVehicle,
      deliveries: items,
    });
  }

  return (
    <AdminLayout title="Create Route">
    <section className="container mx-auto py-16 max-w-3xl">
      <Card className="w-full p-6 lg:p-8 space-y-8">
        <div>
          <h3 className="text-2xl font-semibold">Create Route</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Assign a vehicle and plan delivery order for this route.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* VEHICLE SELECT */}
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Select onValueChange={setSelectedVehicle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v: any) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.plate_number} — {v.model || "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DELIVERY ITEMS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base">Deliveries</Label>
              <Button type="button" onClick={addDelivery}>
                + Add Delivery
              </Button>
            </div>

            {items.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No deliveries added. Click “Add Delivery”.
              </p>
            )}

            <div className="space-y-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg"
                >
                  {/* DELIVERY SELECT */}
                  <div className="space-y-2">
                    <Label>Delivery</Label>
                    <Select
                      value={String(item.id)}
                      onValueChange={(val) => {
                        const updated = [...items];
                        updated[i].id = Number(val);
                        setItems(updated);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveries.map((d: any) => (
                          <SelectItem key={d.id} value={String(d.id)}>
                            #{d.id} — {d.customer_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* SEQUENCE NUMBER */}
                  <div className="space-y-2">
                    <Label>Sequence</Label>
                    <Input
                      type="number"
                      value={item.sequence}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i].sequence = Number(e.target.value);
                        setItems(updated);
                      }}
                    />
                  </div>

                  {/* REMOVE BUTTON */}
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeDelivery(i)}
                      className="w-full"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="w-full">
            Create Route
          </Button>
        </form>
      </Card>
    </section>
    </AdminLayout>
  );
}