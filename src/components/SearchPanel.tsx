'use client'

import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'

interface SearchPanelProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    userCount: number
    totalCount: number
}

export function SearchPanel({ searchQuery, onSearchChange, userCount, totalCount }: SearchPanelProps) {
    return (
        <Card className="absolute top-4 left-4 w-80 z-10 shadow-xl">
            <div className="p-4 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{userCount}</span> of{' '}
                    <span className="font-semibold text-foreground">{totalCount}</span> users
                </div>
            </div>
        </Card>
    )
}
