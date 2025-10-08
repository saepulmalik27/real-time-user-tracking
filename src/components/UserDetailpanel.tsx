'use client'

import { User } from '@/types/user.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Navigation } from 'lucide-react'

interface UserDetailsPanelProps {
    user: User
    onClose: () => void
    onFollow: () => void
    isFollowing: boolean
}

export function UserDetailsPanel({ user, onClose, onFollow, isFollowing }: UserDetailsPanelProps) {
    return (
        <Card className="absolute top-4 right-4 w-80 z-10 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">User Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: user.color }} />
                        <span className="font-semibold">{user.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                            <strong>ID:</strong> {user.id}
                        </p>
                        <p>
                            <strong>Latitude:</strong> {user.latitude.toFixed(6)}
                        </p>
                        <p>
                            <strong>Longitude:</strong> {user.longitude.toFixed(6)}
                        </p>
                        <p>
                            <strong>Speed:</strong> {(user.speed * 1000).toFixed(4)} units/s
                        </p>
                        <p>
                            <strong>Direction:</strong> {user.direction.toFixed(1)}°
                        </p>
                    </div>
                </div>
                <Button className="w-full" variant={isFollowing ? 'destructive' : 'default'} onClick={onFollow}>
                    <Navigation className="mr-2 h-4 w-4" />
                    {isFollowing ? 'Unfollow' : 'Follow User'}
                </Button>
            </CardContent>
        </Card>
    )
}
