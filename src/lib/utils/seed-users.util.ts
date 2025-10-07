import { JAKARTA_BBOX } from '@/lib/constants/geo.constants'
import { TUserLocation } from '@/lib/types/users.type'

export const randomInBbox = () => ({
    lat: JAKARTA_BBOX.minLat + Math.random() * (JAKARTA_BBOX.maxLat - JAKARTA_BBOX.minLat),
    lng: JAKARTA_BBOX.minLng + Math.random() * (JAKARTA_BBOX.maxLng - JAKARTA_BBOX.minLng),
})

/**
 * Generate a list of user with locations on jakarta area.
 * @param count
 * @returns
 */

export function seedUsers(count: number = 120): TUserLocation[] {
    return Array.from({ length: count }, (_, i) => {
        const { lat, lng } = randomInBbox()
        return {
            id: (i + 1).toString(),
            name: `Malik ${i + 1}`,
            latitude: lat,
            longitude: lng,
            speed: parseFloat((Math.random() * 3).toFixed(2)),
        }
    })
}
