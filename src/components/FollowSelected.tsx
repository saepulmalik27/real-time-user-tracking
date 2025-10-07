'use client'
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { useUsersStore } from '@/store/useUserStore'

// Keeps the map centered on the selected user while follow mode is on.
export default function FollowSelected() {
    const map = useMap()
    const follow = useUsersStore((s) => s.follow)
    const selectedId = useUsersStore((s) => s.selectedId)
    const users = useUsersStore((s) => s.users)
    const last = useRef<{ lat: number; lng: number } | null>(null)

    useEffect(() => {
        if (!follow || !selectedId) return
        const u = users.find((x) => x.id === selectedId)
        if (!u) return
        const pos = { lat: u.latitude, lng: u.longitude }
        const should = !last.current || Math.hypot(pos.lat - last.current.lat, pos.lng - last.current.lng) > 0.0005
        if (should) {
            map.setView([pos.lat, pos.lng])
            last.current = pos
        }
    }, [map, follow, selectedId, users])

    return null
}
