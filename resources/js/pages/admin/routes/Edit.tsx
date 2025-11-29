import AdminLayout from "@/layouts/AdminLayout"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { SortableDeliveryList } from "@/components/sortable-delivery-list"
import { useState, useEffect } from "react"

export default function Edit({ route, vehicles, allDeliveries }: any) {
  // Prepare initial ordered deliveries
  const sorted = [...route.deliveries].sort(
    (a: any, b: any) => a.pivot.sequence - b.pivot.sequence
  )

  const [list, setList] = useState(sorted)

  const { data, setData, put, errors } = useForm({
    vehicle_id: route.vehicle_id,
    deliveries: [] as any[],
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    const ordered = list.map((d: any, index: number) => ({
      id: d.id,
      sequence: index,
    }))

    setData("deliveries", ordered)

    put(`/admin/routes/${route.id}`)
  }

  return (
    <AdminLayout>
      <div className="px-4 lg:px-6 space-y-6">

        <h1 className="text-2xl font-semibold">Edit Route</h1>

        <form onSubmit={submit} className="space-y-6">

          {/* VEHICLE SELECT */}
          <div>
            <label className="text-sm font-medium block mb-1">Vehicle</label>
            <Select
              value={String(data.vehicle_id)}
              onValueChange={(v) => setData("vehicle_id", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>

              <SelectContent>
                {vehicles.map((v: any) => (
                  <SelectItem key={v.id} value={v.id.toString()}>
                    {v.plate_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.vehicle_id && (
              <p className="text-red-500">{errors.vehicle_id}</p>
            )}
          </div>

          {/* DELIVERY SORTING */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Delivery Order (drag to reorder)
            </label>

            <SortableDeliveryList items={list} setItems={setList} />
          </div>

          <Button type="submit">Update Route</Button>
        </form>
      </div>
    </AdminLayout>
  )
}