import { ClientMsg, ServerMsg } from '@/lib/types/message.type'
import { MoveMode } from '@/lib/types/user.state.type'
import { useUsersStore } from '@/store/useUserStore'
import { useCallback, useEffect, useRef } from 'react'

export const useUsersWebSocket = () => {
    const wsRef = useRef<WebSocket | null>(null)
    const pollRef = useRef<number | null>(null)
    const fallbackActiveRef = useRef(false)
    const setUsers = useUsersStore((s) => s.setUsers)
    const setModeLocal = useUsersStore((s) => s.setModeLocal)
    const setConnected = useUsersStore((s) => s.setConnected)
    const setError = useUsersStore((s) => s.setError)

    const wsUrl =
        typeof window !== 'undefined'
            ? location.origin.replace(/^http/, 'ws') + '/api/realtime'
            : 'ws://localhost:3000/api/realtime'

    const send = useCallback((msg: ClientMsg) => {
        const ws = wsRef.current
        if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg))
    }, [])

    const startPolling = useCallback(() => {
        if (pollRef.current) return
        fallbackActiveRef.current = true
        setConnected(false)
        pollRef.current = window.setInterval(async () => {
            try {
                const res = await fetch('/api/realtime', { cache: 'no-store' })
                if (!res.ok) return
                const data = await res.json()
                if (data?.type === 'state' && Array.isArray(data.users)) {
                    setUsers(data.users)
                    if (typeof data.mode === 'string') setModeLocal(data.mode as MoveMode)
                    console.debug('poll:state', data.users.length)
                }
            } catch {}
        }, 1000)
    }, [setConnected, setModeLocal, setUsers])

    const stopPolling = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current)
            pollRef.current = null
        }
        fallbackActiveRef.current = false
    }, [])

    useEffect(() => {
        let retry = 0
        let stopped = false

        const connect = () => {
            const ws = new WebSocket(wsUrl)
            wsRef.current = ws
            const openTimeout = window.setTimeout(() => {
                if (ws.readyState !== WebSocket.OPEN) startPolling()
            }, 1500)

            ws.onopen = () => {
                setConnected(true)
                setError(undefined)
                retry = 0
                stopPolling()
                window.clearTimeout(openTimeout)
            }
            ws.onmessage = (ev) => {
                try {
                    const msg = JSON.parse(ev.data) as ServerMsg
                    if (msg.type === 'state') {
                        console.debug('ws:state', msg.users?.length ?? 0)
                        setUsers(msg.users)
                    }
                    if (msg.type === 'mode') {
                        console.debug('ws:mode', msg.mode)
                        setModeLocal(msg.mode)
                    }
                } catch (e: any) {
                    setError(String(e?.message || e))
                }
            }
            ws.onerror = () => {
                setError('WebSocket error')
                startPolling()
            }
            ws.onclose = () => {
                setConnected(false)
                if (!stopped) {
                    const delay = Math.min(5000, 500 * 2 ** retry)
                    retry++
                    setTimeout(connect, delay)
                }
                startPolling()
            }
        }

        connect()
        return () => {
            stopped = true
            wsRef.current?.close()
            wsRef.current = null
        }
    }, [wsUrl, setUsers, setModeLocal, setConnected, setError])

    const setMode = useCallback((mode: MoveMode) => send({ type: 'set-mode', mode }), [send])
    const reseed = useCallback(
        (count: number) => {
            if (fallbackActiveRef.current) {
                // Hit JSON fallback with query param
                fetch(`/api/realtime?seed=${encodeURIComponent(count)}`, { cache: 'no-store' }).catch(() => {})
            } else {
                send({ type: 'seed', count })
            }
        },
        [send],
    )

    return { setMode, reseed }
}
