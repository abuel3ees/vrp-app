import AdminLayout from "@/Layouts/AdminLayout"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Show({ driver }: any) {
  return (
    <AdminLayout>
      <div className="px-4 lg:px-6 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Driver Details</h1>

          <Link href={`/admin/drivers/${driver.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>

        <Card className="p-4 space-y-2">
          <p><strong>Name:</strong> {driver.name}</p>
          <p><strong>Phone:</strong> {driver.phone}</p>
          <p><strong>Email:</strong> {driver.email}</p>
          <p><strong>Created:</strong> {driver.created_at}</p>
        </Card>

        <Link href="/admin/drivers">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>
    </AdminLayout>
  )
}