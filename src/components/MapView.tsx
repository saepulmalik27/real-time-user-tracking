'use client'
import { jakartaCoordinates } from '@/lib/constants/geo.constants'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { seedUsers } from '@/lib/utils/seed-users.util'

const MapView = () => {
    const users = seedUsers(150)
    return (
        <MapContainer center={jakartaCoordinates} zoom={13} preferCanvas={true} className="w-full h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {users.map((user) => (
                <CircleMarker
                    key={user.id}
                    center={[user.latitude, user.longitude]}
                    pathOptions={{ color: 'blue', fillOpacity: 0.8 }}
                    radius={6}
                >
                    <Popup>{user.name}</Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    )
}

export default MapView
