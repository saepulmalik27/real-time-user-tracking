import { User } from '@/types/user.types'
import { MapPin } from 'lucide-react'
import { Marker } from 'react-map-gl/maplibre'
interface UserMarkerProps {
    user: User
    isSelected: boolean
    onClick: (user: User) => void
}

export function UserMarker({ user, isSelected, onClick }: UserMarkerProps) {
    console.log({ user })

    return (
        <Marker
            latitude={user.latitude}
            longitude={user.longitude}
            anchor="bottom"
            onClick={(e) => {
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
