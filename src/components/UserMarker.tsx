import { Marker } from 'react-map-gl/maplibre'
import { User } from '@/types/user.types'
import { MapPin } from 'lucide-react'

interface UserMarkerProps {
    user: User
    isSelected: boolean
    onClick: (user: User) => void
}

export function UserMarker({ user, isSelected, onClick }: UserMarkerProps) {
    return (
        <Marker
            latitude={user.latitude}
            longitude={user.longitude}
            anchor="bottom"
            onClick={(e: unknown) => {
                // @ts-expect-error : type issue with react-map-gl
                e.originalEvent.stopPropagation()
                onClick(user)
            }}
        >
            <div
                className={`cursor-pointer transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}`}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
                <MapPin size={isSelected ? 32 : 24} fill={user.color} stroke="white" strokeWidth={2} />
            </div>
        </Marker>
    )
}
