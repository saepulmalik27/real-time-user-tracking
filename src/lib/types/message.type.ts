import { MoveMode } from './user.state.type'
import { TUserLocation } from './users.type'

export type ServerMsg = { type: 'state'; users: TUserLocation[] } | { type: 'mode'; mode: MoveMode }

export type ClientMsg = { type: 'set-mode'; mode: MoveMode } | { type: 'seed'; count: number }
