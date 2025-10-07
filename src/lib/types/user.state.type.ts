import { TUserLocation } from './users.type'

export type MoveMode = 'random' | 'smooth'

export type UsersState = {
    users: TUserLocation[]
    mode: MoveMode
    connected: boolean
    error?: string
    setUsers: (u: TUserLocation[]) => void
    setModeLocal: (m: MoveMode) => void
    setConnected: (c: boolean) => void
    setError: (e?: string) => void
    // UI state
    search?: string
    selectedId?: string
    follow?: boolean
    setSearch?: (q: string) => void
    select?: (id?: string) => void
    toggleFollow?: () => void
}
