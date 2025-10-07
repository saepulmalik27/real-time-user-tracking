// store/useUsersStore.ts
import { UsersState } from '@/lib/types/user.state.type'
import { create } from 'zustand'

export const useUsersStore = create<UsersState>((set) => ({
    users: [],
    mode: 'random',
    connected: false,
    error: undefined,
    setUsers: (u) => set({ users: u }),
    setModeLocal: (m) => set({ mode: m }),
    setConnected: (c) => set({ connected: c, error: c ? undefined : undefined }),
    setError: (e) => set({ error: e }),
    // UI state
    search: '',
    selectedId: undefined,
    follow: false,
    setSearch: (q) => set({ search: q }),
    select: (id) => set({ selectedId: id }),
    toggleFollow: () => set((s) => ({ follow: !s.follow })),
}))
