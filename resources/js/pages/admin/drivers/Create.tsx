"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
export default function CreateDriver() {
  function submit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);
    router.post("/admin/drivers", form);
  }

  return (
    <AdminLayout title="Create Driver">
      <section className="container mx-auto py-16 max-w-2xl">
        <Card className="w-full p-6 lg:p-8">

        <div className="mb-6">
          <h3 className="text-2xl font-semibold">Create Driver</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Add a new delivery driver with contact information.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-6">

          {/* NAME */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" required />
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input name="phone" placeholder="+962 7X XXX XXXX" />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label>Email (Optional)</Label>
            <Input name="email" type="email" />
          </div>

          <Button type="submit" className="w-full">Create Driver</Button>

        </form>
      </Card>
    </section>
    </AdminLayout>
  );
}