'use client'
import { useMemo } from 'react'
import Map, { ViewState } from 'react-map-gl/maplibre'
import { UserMarker } from './UserMarker'
import { useUserStore } from '@/store/user-store'
import { useUserTrackingMap } from '@/hooks/use-user-tracking-map'

const initialViewState: Partial<ViewState> = {
    longitude: 117.5,
    latitude: -2.5,
    zoom: 4.5,
}

export default function UserTrackingMap() {
    const { mapRef } = useUserTrackingMap()
    const { filteredUsers } = useUserStore()

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
