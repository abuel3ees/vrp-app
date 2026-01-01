import AdminLayout from "@/Layouts/AdminLayout"
import { Link } from "@inertiajs/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function Show({ delivery }: any) {
  return (
    <AdminLayout>
      <div className="px-4 lg:px-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Delivery Details</h1>

          <Link href={`/admin/deliveries/${delivery.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>

        {/* DETAILS CARD */}
        <Card className="p-4 space-y-3">
          <p><strong>ID:</strong> {delivery.id}</p>
          <p><strong>Customer Name:</strong> {delivery.customer_name}</p>
          <p><strong>Address:</strong> {delivery.address}</p>
          <p><strong>Status:</strong> {delivery.status}</p>
          <p><strong>Deadline:</strong> {delivery.deadline ?? "-"}</p>
          <p><strong>Latitude:</strong> {delivery.lat}</p>
          <p><strong>Longitude:</strong> {delivery.lng}</p>
        </Card>

        {/* STATIC MAP */}
        <Card className="p-0 overflow-hidden">
          <MapContainer
            center={[delivery.lat, delivery.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[delivery.lat, delivery.lng]}
              icon={icon}
            />
          </MapContainer>
        </Card>

        {/* BACK BUTTON */}
        <Link href="/admin/deliveries">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>
    </AdminLayout>
  )
}