import { create } from 'zustand'
import { User } from '@/types/user.types'
import { generateUsers, updateUserPosition } from '@/lib/user-generator.util'

interface UserStore {
    users: User[]
    selectedUser: User | null
    followedUserId: string | null
    searchQuery: string
    filteredUsers: User[]
    initializeUsers: (count: number) => void
    updateUserPositions: () => void
    selectUser: (user: User | null) => void
    followUser: (userId: string | null) => void
    setSearchQuery: (query: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    selectedUser: null,
    followedUserId: null,
    searchQuery: '',
    filteredUsers: [],

    initializeUsers: (count: number) => {
        const users = generateUsers(count)
        set({ users, filteredUsers: users })
    },

    updateUserPositions: () => {
        set((state) => {
            const updatedUsers = state.users.map(updateUserPosition)
            const { searchQuery } = state

            const filteredUsers = searchQuery
                ? updatedUsers.filter(
                      (user) =>
                          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.id.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                : updatedUsers

            const updatedSelectedUser = state.selectedUser
                ? updatedUsers.find((u) => u.id === state.selectedUser!.id) || null
                : null

            return {
                users: updatedUsers,
                filteredUsers,
                selectedUser: updatedSelectedUser,
            }
        })
    },

    selectUser: (user: User | null) => {
        set({ selectedUser: user })
    },

    followUser: (userId: string | null) => {
        set({ followedUserId: userId })
    },

    setSearchQuery: (query: string) => {
        set((state) => {
            const filteredUsers = query
                ? state.users.filter(
                      (user) =>
                          user.name.toLowerCase().includes(query.toLowerCase()) ||
                          user.id.toLowerCase().includes(query.toLowerCase()),
                  )
                : state.users

            return { searchQuery: query, filteredUsers }
        })
    },
}))
