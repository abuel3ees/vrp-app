import AdminLayout from "@/Layouts/AdminLayout"
import { Link } from "@inertiajs/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet"
import L from "leaflet"

interface Delivery {
  id: number;
  lat: number;
  lng: number;
  customer_name: string;
  address: string;
}

interface RouteData {
  id: number;
  vehicle?: { plate_number: string };
  deliveries: Delivery[];
}

interface ShowProps {
  route: RouteData;
}

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function Show({ route }: ShowProps) {
  // deliveries are already sorted by pivot.sequence
  const points: [number, number][] = route.deliveries.map((d) => [d.lat, d.lng])

  return (
    <AdminLayout>
      <div className="px-4 lg:px-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Route Details</h1>

          <Link href={`/admin/routes/${route.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>

        {/* ROUTE INFO */}
        <Card className="p-4 space-y-3">
          <p><strong>ID:</strong> {route.id}</p>
          <p><strong>Vehicle:</strong> {route.vehicle?.plate_number}</p>
          <p><strong>Total Deliveries:</strong> {route.deliveries.length}</p>
        </Card>

        {/* DELIVERY ORDER LIST */}
        <Card className="p-4 space-y-3">
          <h2 className="font-semibold text-lg mb-2">Delivery Order</h2>

          {route.deliveries.map((d, index) => (
            <div
              key={d.id}
              className="p-3 bg-muted rounded-md flex justify-between"
            >
              <div>
                <p className="font-semibold">{index + 1}. {d.customer_name}</p>
                <p className="text-sm text-muted-foreground">{d.address}</p>
              </div>
            </div>
          ))}
        </Card>

        {/* MAP */}
        <Card className="p-0 overflow-hidden">
          <MapContainer
            center={points.length ? points[0] : [31.95, 35.91]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "450px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Markers in order */}
            {route.deliveries.map((d) => (
              <Marker
                key={d.id}
                position={[d.lat, d.lng]}
                icon={icon}
              />
            ))}

            {/* Polyline connecting them */}
            {points.length > 1 && (
              <Polyline positions={points} color="blue" weight={4} />
            )}
          </MapContainer>
        </Card>

        {/* BACK */}
        <Link href="/admin/routes">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>
    </AdminLayout>
  )
}