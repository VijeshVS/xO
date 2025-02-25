import { Game } from "./types/main";
import { WebSocket as WsWebSocket } from "ws";

class GameManager {
  private games: Game[];
  private pendingUser: WsWebSocket | null;

  constructor() {
    this.games = [];
    this.pendingUser = null;
  }

  createGame(user: WsWebSocket) {
    if (this.pendingUser) {
      const game: Game = {
        id: Math.random().toString(36).substring(7),
        player1: this.pendingUser,
        player2: user,
        board: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        moves: [],
      };
      this.games.push(game);
      this.pendingUser = null;

      return {
        status: "ready",
        game,
      };
    } else {
      this.pendingUser = user;

      user.on("close", () => {
        if(user == this.pendingUser){
          this.pendingUser = null;
        }
        else {
          const game = this.games.find((game) => game.player1 === user || game.player2 === user);
          if(game){
            this.games.splice(this.games.indexOf(game), 1);
            if(game.player1 == user){
              game.player2.send(
                JSON.stringify({
                  status: "GAME_OVER",
                  winner: 2,
                  abort: true
                })
              );
            }
            if(game.player2 == user){
              game.player1.send(
                JSON.stringify({
                  status: "GAME_OVER",
                  winner: 1,
                  abort: true
                })
              );
            }
          }
        }
      });

      return {
        status: "pending",
      };
    }
  }

  getGame(id: string) {
    return this.games.find((game) => game.id === id);
  }

  checkWinner(board: string[][]) {
    // check rows
    for (let i = 0; i < 3; i++) {
      const arr = [];
      for (let j = 0; j < 3; j++) {
        arr.push(board[i][j]);
      }
      if (arr.every((val) => val === "X") || arr.every((val) => val === "O")) {
        return true;
      }
    }

    // check cols
    for (let i = 0; i < 3; i++) {
      const arr = [];
      for (let j = 0; j < 3; j++) {
        arr.push(board[j][i]);
      }
      if (arr.every((val) => val === "X") || arr.every((val) => val === "O")) {
        return true;
      }
    }

    // check diagonals
    const arr1 = [board[0][0], board[1][1], board[2][2]];
    const arr2 = [board[0][2], board[1][1], board[2][0]];
    if (arr1.every((val) => val === "X") || arr1.every((val) => val === "O")) {
      return true;
    }
    if (arr2.every((val) => val === "X") || arr2.every((val) => val === "O")) {
      return true;
    }

    return false;
  }

  makeMove(id: string, player: WsWebSocket, row: number, col: number) {
    const game = this.getGame(id);

    if (!game) {
      player.send(
        JSON.stringify({
          status: "error",
          reason: "Game not found"
        })
      );
      return;
    }

    if (game.moves.length % 2 == 0 && game.player1 !== player) {
      player.send(
        JSON.stringify({
          status: "error",
          reason: "Opponent's turn"
        })
      );
      return;
    }

    if (game.moves.length % 2 == 1 && game.player2 !== player) {
      player.send(
        JSON.stringify({
          status: "error",
          reason: "Opponent's turn"
        })
      );
      return;
    }

    if (game.board[row][col] !== "") {
      player.send(
        JSON.stringify({
          status: "error",
          reason: "Cell already taken"
        })
      );
      return;
    }

    game.board[row][col] = game.moves.length % 2 == 0 ? "X" : "O";
    // row,col|X
    const move = `${row},${col}|${game.board[row][col]}`;
    game.moves.push(move);

    game.player1.send(
      JSON.stringify({
        status: "MOVE",
        move,
      })
    );
    game.player2.send(
      JSON.stringify({
        status: "MOVE",
        move,
      })
    );

    // check if game is over
    if (this.checkWinner(game.board)) {
      game.player1.send(
        JSON.stringify({
          status: "GAME_OVER",
          winner: game.moves.length % 2 == 0 ? 2 : 1,
        })
      );
      game.player2.send(
        JSON.stringify({
          status: "GAME_OVER",
          winner: game.moves.length % 2 == 0 ? 2 : 1,
        })
      );

      this.games.splice(this.games.indexOf(game), 1);
    }
    // draw send winner is no one
    else if (game.moves.length == 9) {
      game.player1.send(
        JSON.stringify({
          status: "GAME_OVER",
          winner: 0,
        })
      );
      game.player2.send(
        JSON.stringify({
          status: "GAME_OVER",
          winner: 0,
        })
      );

      this.games.splice(this.games.indexOf(game), 1);
    }
  }
}

export default GameManager;
