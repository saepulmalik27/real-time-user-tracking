import { useUserStore } from '@/store/user-store'
import { User } from '@/types/user.types'
import { useEffect, useRef } from 'react'
import { MapRef } from 'react-map-gl/maplibre'

export const useUserTrackingMap = () => {
    const mapRef = useRef<MapRef>(null)
    const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const { users, selectedUser, followedUserId, initializeUsers, updateUserPositions, followUser } = useUserStore()

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

    const handleFollow = () => {
        if (selectedUser) {
            if (followedUserId === selectedUser.id) {
                followUser(null)
            } else {
                followUser(selectedUser.id)
            }
        }
    }

    return {
        handleFollow,
        mapRef,
    }
}
