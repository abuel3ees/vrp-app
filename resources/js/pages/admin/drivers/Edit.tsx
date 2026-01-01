import AdminLayout from "@/Layouts/AdminLayout"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Edit({ driver }: any) {
  const { data, setData, put, errors } = useForm({
    name: driver.name,
    phone: driver.phone,
    email: driver.email,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/admin/drivers/${driver.id}`)
  }

  return (
    <AdminLayout>
      <div className="px-4 lg:px-6 space-y-4">
        <h1 className="text-2xl font-semibold">Edit Driver</h1>

        <form onSubmit={submit} className="space-y-4">
          <Input
            placeholder="Name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />

          <Input
            placeholder="Phone"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
          />

          <Input
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
          />

          <Button type="submit">Update</Button>
        </form>
      </div>
    </AdminLayout>
  )
}