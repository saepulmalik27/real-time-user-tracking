// import { TUserLocation } from "../types/users.type"

import { JAKARTA_BBOX } from '../constants/geo.constants'
import { TUserLocation } from '../types/users.type'

const METERS_PER_DEG_LAT = 111_320
const metersPerDegLngAt = (lat: number) => METERS_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180)

export const moveUserWithinJakarta = (user: TUserLocation): TUserLocation => {
    // choose random direction each tick
    const theta = Math.random() * 2 * Math.PI
    const distance = user.speed // per tick = 1 second
    const dLat = (distance / METERS_PER_DEG_LAT) * Math.sin(theta)
    const dLng = (distance / metersPerDegLngAt(user.latitude)) * Math.cos(theta)

    let newLat = user.latitude + dLat
    let newLng = user.longitude + dLng

    // clamp inside Jakarta bbox
    if (newLat < JAKARTA_BBOX.minLat) newLat = JAKARTA_BBOX.minLat
    if (newLat > JAKARTA_BBOX.maxLat) newLat = JAKARTA_BBOX.maxLat
    if (newLng < JAKARTA_BBOX.minLng) newLng = JAKARTA_BBOX.minLng
    if (newLng > JAKARTA_BBOX.maxLng) newLng = JAKARTA_BBOX.maxLng

    return { ...user, latitude: newLat, longitude: newLng }
}
