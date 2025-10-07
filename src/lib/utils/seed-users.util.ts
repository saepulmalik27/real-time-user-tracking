import { jakartaCoordinatesObj } from '@/lib/constants/general.constants'
import { TUserLocation } from '../types/users.type'

/**
 * Generate a list of user with locations on jakarta area.
 * @param count
 * @returns
 */

export function seedUsers(count: number = 120): TUserLocation[] {
    const center = jakartaCoordinatesObj
    const radius = 0.5

    return Array.from({ length: count }, (_, i) => {
        const angle = Math.random() * 2 * Math.PI
        const distance = Math.random() * radius

        const latitude = center.lat + distance * Math.cos(angle)
        const longitude = center.lng + distance * Math.sin(angle)

        return {
            id: (i + 1).toString(),
            name: `Malik ${i + 1}`,
            latitude,
            longitude,
            speed: parseFloat((Math.random() * 3).toFixed(2)),
        }
    })
}

/**
 * Simulate user movement by updating their latitude and longitude based on their speed and a random direction.
 */
export function stepUsers(users: TUserLocation[]): TUserLocation[] {
    return users.map((user) => {
        const angle = Math.random() * 2 * Math.PI
        const distance = (user?.speed ?? 1) * 0.001 // Convert speed to degrees

        const latitude = user.latitude + distance * Math.cos(angle)
        const longitude = user.longitude + distance * Math.sin(angle)

        return {
            ...user,
            latitude,
            longitude,
        }
    })
}
