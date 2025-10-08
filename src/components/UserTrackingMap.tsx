'use client'
import { generateUsers } from '@/lib/user-generator.util'
import { useMemo, useRef } from 'react'
import Map, { MapRef, ViewState } from 'react-map-gl/maplibre'
import { UserMarker } from './UserMarker'

const initialViewState: Partial<ViewState> = {
    longitude: 117.5,
    latitude: -2.5,
    zoom: 4.5,
}

export default function UserTrackingMap() {
    const mapRef = useRef<MapRef | null>(null)
    //   const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const filteredUsers = generateUsers(2)

    const markers = useMemo(() => {
        return filteredUsers.map((user) => (
            <UserMarker
                key={user.id}
                user={user}
                isSelected={true}
                onClick={() => {
                    console.log(user.name)
                }}
            />
        ))
    }, [filteredUsers])

    return (
        <div className="relative w-full h-screen">
            <Map
                ref={mapRef}
                initialViewState={initialViewState}
                mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                style={{ width: '100%', height: '100%' }}
                onClick={() => {}}
            >
                {markers}
            </Map>
        </div>
    )
}
