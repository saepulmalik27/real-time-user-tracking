'use client'
import dynamic from 'next/dynamic'
import { jakartaCoordinates } from '@/lib/constants/geo.constants'

const CircleMarker = dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), {
    ssr: false,
})
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
    ssr: false,
})
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })

import 'leaflet/dist/leaflet.css'
import { useMemo } from 'react'
import { useUsersStore } from '@/store/useUserStore'
import { useUsersWebSocket } from '@/hooks/useUsersWebSocket'
import FollowSelected from '@/components/FollowSelected'

const MapView = () => {
    const users = useUsersStore((s) => s.users)
    const connected = useUsersStore((s) => s.connected)
    const mode = useUsersStore((s) => s.mode)
    const search = useUsersStore((s) => s.search || '')
    const follow = useUsersStore((s) => !!s.follow)
    const selectedId = useUsersStore((s) => s.selectedId)
    const setSearch = useUsersStore((s) => s.setSearch!)
    const select = useUsersStore((s) => s.select!)
    const toggleFollow = useUsersStore((s) => s.toggleFollow!)
    const { reseed } = useUsersWebSocket()

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return users
        return users.filter((u) => u.id.toLowerCase().includes(q) || u.name.toLowerCase().includes(q))
    }, [users, search])

    return (
        <div className="w-screen h-screen relative">
            {/* Status overlay */}
            <div className="absolute z-[1000] top-4 left-4 flex items-center gap-2 bg-background/80 backdrop-blur rounded px-3 py-2 shadow border">
                <span
                    className={'inline-block h-2.5 w-2.5 rounded-full ' + (connected ? 'bg-green-500' : 'bg-red-500')}
                    aria-label={connected ? 'Connected' : 'Disconnected'}
                />
                <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
                <span className="text-sm">Users: {users.length}</span>
                <span className="text-sm">Mode: {mode}</span>
                <button className="text-xs border rounded px-2 py-1" onClick={() => reseed(150)} title="Reseed users">
                    Reseed 150
                </button>
                <input
                    className="ml-2 text-sm border rounded px-2 py-1 bg-transparent"
                    placeholder="Search id or name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="text-xs border rounded px-2 py-1"
                    onClick={() => toggleFollow()}
                    aria-pressed={follow}
                >
                    {follow ? 'Unfollow' : 'Follow'}
                </button>
            </div>

            <MapContainer center={jakartaCoordinates} zoom={13} preferCanvas={true} className="w-full h-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FollowSelected />
                {filtered.map((user) => (
                    <CircleMarker
                        key={user.id}
                        center={[user.latitude, user.longitude]}
                        pathOptions={{ color: selectedId === user.id ? '#f43f5e' : 'blue', fillOpacity: 0.8 }}
                        radius={6}
                        eventHandlers={{ click: () => select(user.id) }}
                    >
                        <Popup>user : {user.name}</Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapView
