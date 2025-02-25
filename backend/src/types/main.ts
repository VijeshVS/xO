import { WebSocket as WsWebSocket } from 'ws';

export const Messages = {
    INIT_GAME : "INIT_GAME",
    MOVE : "MOVE"
}

export interface Game {
    id: string;
    player1: WsWebSocket,
    player2: WsWebSocket,
    board: string[][],
    moves: string[]
}