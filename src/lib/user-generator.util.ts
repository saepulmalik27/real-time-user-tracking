import { User } from '@/types/user.types'

const FIRST_NAMES = [
    'Budi',
    'Andi',
    'Siti',
    'Dewi',
    'Agus',
    'Fitri',
    'Rudi',
    'Maya',
    'Eko',
    'Sri',
    'Dian',
    'Hadi',
    'Rina',
    'Yudi',
    'Ani',
    'Toni',
    'Wati',
    'Joko',
    'Lina',
    'Adi',
    'Sari',
    'Doni',
    'Nina',
    'Hendra',
]

const LAST_NAMES = [
    'Santoso',
    'Wijaya',
    'Pratama',
    'Susanto',
    'Putra',
    'Wibowo',
    'Kurniawan',
    'Sutanto',
    'Setiawan',
    'Hidayat',
    'Firmansyah',
    'Gunawan',
    'Saputra',
    'Hartono',
    'Nugroho',
    'Suryanto',
    'Rahman',
    'Prasetyo',
    'Utomo',
    'Handoko',
    'Mahendra',
    'Irawan',
    'Lestari',
    'Permana',
]

const COLORS = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B739',
    '#52B788',
]

const CITIES = [
    { lat: -6.2088, lng: 106.8456, name: 'Jakarta' },
    { lat: -7.2575, lng: 112.7521, name: 'Surabaya' },
    { lat: -6.9175, lng: 107.6191, name: 'Bandung' },
    { lat: -0.9471, lng: 100.4172, name: 'Padang' },
    { lat: -7.7956, lng: 110.3695, name: 'Yogyakarta' },
    { lat: -8.6705, lng: 115.2126, name: 'Denpasar' },
    { lat: 3.5952, lng: 98.6722, name: 'Medan' },
    { lat: -6.9932, lng: 110.4203, name: 'Semarang' },
    { lat: -5.1477, lng: 119.4327, name: 'Makassar' },
    { lat: 1.4748, lng: 124.8421, name: 'Manado' },
]

export function generateUsers(count: number): User[] {
    const users: User[] = []

    for (let i = 0; i < count; i++) {
        const city = CITIES[Math.floor(Math.random() * CITIES.length)]
        const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
        const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]

        users.push({
            id: `user-${i + 1}`,
            name: `${firstName} ${lastName}`,
            latitude: city.lat + (Math.random() - 0.5) * 0.5,
            longitude: city.lng + (Math.random() - 0.5) * 0.5,
            speed: 0.0001 + Math.random() * 0.0002,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            direction: Math.random() * 360,
        })
    }

    return users
}

export function updateUserPosition(user: User): User {
    const directionChange = (Math.random() - 0.5) * 30
    const newDirection = (user.direction + directionChange + 360) % 360

    const radians = (newDirection * Math.PI) / 180
    const latChange = Math.cos(radians) * user.speed
    const lngChange = Math.sin(radians) * user.speed

    return {
        ...user,
        latitude: user.latitude + latChange,
        longitude: user.longitude + lngChange,
        direction: newDirection,
    }
}
