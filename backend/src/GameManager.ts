import { Game } from './types/main';

class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
        
    constructor() {
        this.games = [];
        this.pendingUser = null;
    }

    createGame(user: WebSocket){
        if(this.pendingUser){
            const game: Game = {
                id: Math.random().toString(36).substring(7),
                player1: this.pendingUser,
                player2: user,
                board: [
                    ['','',''],
                    ['','',''],
                    ['','','']
                ],
                moves: []
            }
            this.games.push(game);
            this.pendingUser = null;

            return {
                status: 'success',
                game
            }
        }
        else {
            this.pendingUser = user;

            return {
                status: 'pending'
            }
        }
    }

    getGame(id: string) {
        return this.games.find(game => game.id === id);
    }

    makeMove(id: string, player: WebSocket, row: number, col: number) {
        const game = this.getGame(id);
        if(!game) return;

        if(game.moves.length % 2 == 0 && game.player1 !== player){
            return;
        }

        if(game.moves.length % 2 == 1 && game.player2 !== player){
            return;
        }

        if(game.board[row][col] !== ''){
            return;
        }

        game.board[row][col] = game.moves.length % 2 == 0 ? 'X' : 'O';
        // row,col|X
        game.moves.push(`${row},${col}|${game.board[row][col]}`);
        // winning validation has to be done here
    }
};

export default GameManager;