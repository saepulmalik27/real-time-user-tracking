'use client'
import dynamic from 'next/dynamic'

import { jakartaCoordinates } from '@/lib/constants/general.constants'

/**
 * not working with nextjs app router
 * import { MapContainer, TileLayer } from "react-leaflet"
 * error : window is not defined
 * solusion : use dynamic import
 */
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false })
import 'leaflet/dist/leaflet.css'

const MapView = () => {
    return (
        <MapContainer center={jakartaCoordinates} zoom={13} preferCanvas={true} className="w-full h-full">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

export default MapView
