import AdminLayout from "@/layouts/AdminLayout"
import { Link } from "@inertiajs/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Show({ vehicle }: any) {
  return (
    <AdminLayout>
      <div className="px-4 lg:px-6 space-y-4">

        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Vehicle Details</h1>

          <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>

        <Card className="p-4 space-y-2">
          <p><strong>ID:</strong> {vehicle.id}</p>
          <p><strong>Plate Number:</strong> {vehicle.plate_number}</p>
          <p><strong>Capacity:</strong> {vehicle.capacity}</p>
          <p><strong>Model:</strong> {vehicle.model || "-"}</p>
          <p><strong>Driver:</strong> {vehicle.driver ? vehicle.driver.name : "No driver"}</p>
          <p><strong>Created:</strong> {vehicle.created_at}</p>
        </Card>

        <Link href="/admin/vehicles">
          <Button variant="secondary">Back</Button>
        </Link>

      </div>
    </AdminLayout>
  )
}