import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { Card } from "@/components/ui/card"

interface MapPickerProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}

// Fix marker icons (Leaflet bug in Vite)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function LocationPicker({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  return (
    <Card className="overflow-hidden border rounded-lg">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker
          position={[lat, lng]}
          icon={markerIcon}
          draggable={true}
          eventHandlers={{
            dragend: (event) => {
              const marker = event.target
              const position = marker.getLatLng()
              onChange(position.lat, position.lng)
            },
          }}
        />

        <LocationPicker onChange={onChange} />
      </MapContainer>
    </Card>
  )
}