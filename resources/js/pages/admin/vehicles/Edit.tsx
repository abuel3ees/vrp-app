import AdminLayout from "@/Layouts/AdminLayout"
import { useForm } from "@inertiajs/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function Edit({ vehicle, drivers }: any) {
  const { data, setData, put, errors } = useForm({
    driver_id: vehicle.driver_id ?? "",
    plate_number: vehicle.plate_number,
    capacity: vehicle.capacity,
    model: vehicle.model ?? "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/admin/vehicles/${vehicle.id}`)
  }

  return (
    <AdminLayout>
      <div className="px-4 lg:px-6 space-y-4">

        <h1 className="text-2xl font-semibold">Edit Vehicle</h1>

        <form onSubmit={submit} className="space-y-4">

          {/* DRIVER SELECT */}
          <div>
            <label className="text-sm font-medium mb-1 block">Driver</label>

            <Select
              value={String(data.driver_id ?? "")}
              onValueChange={(value) => setData("driver_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select driver (optional)" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="">No Driver</SelectItem>

                {drivers.map((d: any) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.driver_id && <p className="text-red-500">{errors.driver_id}</p>}
          </div>

          {/* PLATE */}
          <div>
            <Input
              placeholder="Plate Number"
              value={data.plate_number}
              onChange={(e) => setData("plate_number", e.target.value)}
            />
            {errors.plate_number && <p className="text-red-500">{errors.plate_number}</p>}
          </div>

          {/* CAPACITY */}
          <div>
            <Input
              type="number"
              placeholder="Capacity"
              value={data.capacity}
              onChange={(e) => setData("capacity", e.target.value)}
            />
            {errors.capacity && <p className="text-red-500">{errors.capacity}</p>}
          </div>

          {/* MODEL */}
          <div>
            <Input
              placeholder="Model"
              value={data.model}
              onChange={(e) => setData("model", e.target.value)}
            />
          </div>

          <Button type="submit">Update Vehicle</Button>
        </form>

      </div>
    </AdminLayout>
  )
}