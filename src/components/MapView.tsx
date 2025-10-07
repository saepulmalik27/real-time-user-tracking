'use client'
import { jakartaCoordinates } from '@/lib/constants/general.constants'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { users } from '@/lib/data/mockup.user'

const MapView = () => {
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
                    pathOptions={{ color: 'blue', fillColor: 'green', fillOpacity: 0.5 }}
                    radius={10}
                >
                    <Popup>{user.name}</Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    )
}

export default MapView
