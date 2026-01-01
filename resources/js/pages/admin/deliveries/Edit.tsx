import AdminLayout from "@/Layouts/AdminLayout"
import { useForm } from "@inertiajs/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPicker } from "@/components/map-picker"

export default function Edit({ delivery }: any) {
  const { data, setData, put, errors } = useForm({
    customer_name: delivery.customer_name,
    address: delivery.address,
    lat: delivery.lat,
    lng: delivery.lng,
    deadline: delivery.deadline ?? "",
    status: delivery.status,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/admin/deliveries/${delivery.id}`)
  }

  return (
    <AdminLayout>
      <div className="px-4 lg:px-6 space-y-6">

        <h1 className="text-2xl font-semibold">Edit Delivery</h1>

        <form onSubmit={submit} className="space-y-5">

          {/* NAME */}
          <div>
            <Input
              placeholder="Customer Name"
              value={data.customer_name}
              onChange={(e) => setData("customer_name", e.target.value)}
            />
            {errors.customer_name && <p className="text-red-500">{errors.customer_name}</p>}
          </div>

          {/* ADDRESS */}
          <div>
            <Input
              placeholder="Address"
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
          </div>

          {/* DEADLINE */}
          <div>
            <label className="text-sm font-medium mb-1 block">Deadline</label>
            <Input
              type="datetime-local"
              value={data.deadline || ""}
              onChange={(e) => setData("deadline", e.target.value)}
            />
            {errors.deadline && <p className="text-red-500">{errors.deadline}</p>}
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <select
              className="border rounded-md px-3 py-2 text-sm w-full"
              value={data.status}
              onChange={(e) => setData("status", e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>

            {errors.status && <p className="text-red-500">{errors.status}</p>}
          </div>

          {/* MAP PICKER */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>

            <MapPicker
              lat={data.lat}
              lng={data.lng}
              onChange={(lat, lng) => {
                setData("lat", lat)
                setData("lng", lng)
              }}
            />

            <div className="flex gap-4">
              <Input value={data.lat} readOnly className="bg-muted" />
              <Input value={data.lng} readOnly className="bg-muted" />
            </div>

            {errors.lat && <p className="text-red-500">{errors.lat}</p>}
            {errors.lng && <p className="text-red-500">{errors.lng}</p>}
          </div>

          <Button type="submit">Update Delivery</Button>
        </form>

      </div>
    </AdminLayout>
  )
}