export const Messages = {
    INIT_GAME : "INIT_GAME",
    MOVE : "MOVE"
}

export interface Game {
    id: string;
    player1: WebSocket,
    player2: WebSocket,
    board: string[][],
    moves: string[]
}