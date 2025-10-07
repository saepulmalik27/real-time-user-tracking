export interface TUser {
    id: string
    name: string
}

export interface TUserLocation extends TUser {
    latitude: number
    longitude: number
    speed?: number // in m/s
}
