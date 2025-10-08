'use client'
import { useEffect, useMemo, useRef } from 'react'
import Map, { MapRef, ViewState } from 'react-map-gl/maplibre'
import { useUserStore } from '@/store/user-store'
import { SearchPanel } from './SearchPanel'
import { UserDetailsPanel } from './UserDetailpanel'
import { User } from '@/types/user.types'
import { UserMarker } from './UserMarker'
import 'maplibre-gl/dist/maplibre-gl.css'

const initialViewState: Partial<ViewState> = {
    longitude: 117.5,
    latitude: -2.5,
    zoom: 4.5,
}

export default function UserTrackingMap() {
    const mapRef = useRef<MapRef>(null)
    const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const {
        users,
        selectedUser,
        followedUserId,
        filteredUsers,
        selectUser,
        searchQuery,
        setSearchQuery,
        initializeUsers,
        updateUserPositions,
        followUser,
    } = useUserStore()

    useEffect(() => {
        initializeUsers(150)

        updateIntervalRef.current = setInterval(() => {
            updateUserPositions()
        }, 1000)

        return () => {
            if (updateIntervalRef.current) {
                clearInterval(updateIntervalRef.current)
            }
        }
    }, [])

    useEffect(() => {
        if (followedUserId && mapRef.current) {
            const followedUser = users.find((u: User) => u.id === followedUserId)
            if (followedUser) {
                mapRef.current.flyTo({
                    center: [followedUser.longitude, followedUser.latitude],
                    zoom: 12,
                    duration: 1000,
                })
            }
        }
    }, [followedUserId, users])

    const markers = useMemo(() => {
        return filteredUsers.map((user) => (
            <UserMarker key={user.id} user={user} isSelected={selectedUser?.id === user.id} onClick={selectUser} />
        ))
    }, [filteredUsers, selectedUser])

    const handleFollow = () => {
        if (selectedUser) {
            if (followedUserId === selectedUser.id) {
                followUser(null)
            } else {
                followUser(selectedUser.id)
            }
        }
    }

    return (
        <div className="relative w-full h-screen">
            <Map
                ref={mapRef}
                initialViewState={initialViewState}
                mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                style={{ width: '100%', height: '100%' }}
                onClick={() => selectUser(null)}
            >
                {markers}
            </Map>

            <SearchPanel
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                userCount={filteredUsers.length}
                totalCount={users.length}
            />

            {selectedUser && (
                <UserDetailsPanel
                    user={selectedUser}
                    onClose={() => selectUser(null)}
                    onFollow={handleFollow}
                    isFollowing={followedUserId === selectedUser.id}
                />
            )}
        </div>
    )
}
