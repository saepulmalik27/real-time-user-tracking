import { ClientMsg, ServerMsg } from '@/lib/types/message.type'
import { MoveMode } from '@/lib/types/user.state.type'
import { TUserLocation } from '@/lib/types/users.type'
import { moveUserWithinJakarta } from '@/lib/utils/move-user.util'
import { seedUsers } from '@/lib/utils/seed-users.util'

export const runtime = 'edge'

// TS ambient so it knows about WebSocketPair
declare class WebSocketPair {
    0: WebSocket
    1: WebSocket
    constructor()
}

// Global state (per-edge instance)
const g = globalThis as unknown as {
    __rt_clients?: Set<WebSocket>
    __rt_users?: TUserLocation[]
    __rt_mode?: MoveMode
    __rt_started?: boolean
}

g.__rt_clients ??= new Set<WebSocket>()
g.__rt_users ??= seedUsers(150)
g.__rt_mode ??= 'random'

// Single ticker
if (!g.__rt_started) {
    g.__rt_started = true
    setInterval(() => {
        g.__rt_users = g.__rt_users!.map((u) => moveUserWithinJakarta(u)) // uses speed + random direction
        const frame: ServerMsg = { type: 'state', users: g.__rt_users! }
        const text = JSON.stringify(frame)
        for (const ws of g.__rt_clients!) {
            try {
                ws.send(text)
            } catch {}
        }
    }, 1000)
}

export async function GET(req: Request) {
    const upgradeHeader = req.headers.get('upgrade') || ''
    const url = new URL(req.url)
    const seedParam = url.searchParams.get('seed')
    if (seedParam) {
        const count = Math.max(1, Math.min(parseInt(seedParam, 10) || 0, 5000))
        if (count) {
            g.__rt_users = seedUsers(count)
        }
    }

    if (upgradeHeader.toLowerCase() !== 'websocket') {
        // JSON fallback for dev or non-WS clients
        return Response.json({ type: 'state', users: g.__rt_users!, mode: g.__rt_mode! })
    }

    const WS = (globalThis as any).WebSocketPair as typeof WebSocketPair | undefined
    if (!WS) {
        // Dev: Edge polyfill missing — serve JSON instead
        return Response.json({ type: 'state', users: g.__rt_users!, mode: g.__rt_mode! })
    }

    const pair = new WS()
    const client = pair[0]
    const server = pair[1]
    ;(server as any).accept()

    // Track client
    g.__rt_clients!.add(server as unknown as WebSocket)

    // Send initial state (mode fixed to random)
    const initMode: ServerMsg = { type: 'mode', mode: g.__rt_mode! }
    ;(server as any).send(JSON.stringify(initMode))
    const initState: ServerMsg = { type: 'state', users: g.__rt_users! }
    ;(server as any).send(JSON.stringify(initState))

    // Optional: if you still support 'seed' from client
    ;(server as any).addEventListener('message', (ev: MessageEvent) => {
        try {
            const msg = JSON.parse(String(ev.data)) as ClientMsg
            if (msg.type === 'seed') {
                const count = Math.max(1, Math.min(msg.count, 5000))
                g.__rt_users = seedUsers(count)
                const packet: ServerMsg = { type: 'state', users: g.__rt_users! }
                const text = JSON.stringify(packet)
                for (const ws of g.__rt_clients!) {
                    try {
                        ws.send(text)
                    } catch {}
                }
            }
            // omit set-mode since you locked to 'random'
        } catch {}
    })

    ;(server as any).addEventListener('close', () => {
        g.__rt_clients!.delete(server as unknown as WebSocket)
    })
    ;(server as any).addEventListener('error', () => {
        g.__rt_clients!.delete(server as unknown as WebSocket)
    })

    // @ts-expect-error Edge Response supports webSocket
    return new Response(null, { status: 101, webSocket: client })
}
