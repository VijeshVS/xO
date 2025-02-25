"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const main_1 = require("./types/main");
const GameManager_1 = __importDefault(require("./GameManager"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.default();
wss.on("connection", function connection(ws) {
    ws.on("error", console.error);
    ws.on("message", function message(data) {
        const message = JSON.parse(data.toString());
        if (message.type == main_1.Messages.INIT_GAME) {
            const { status, game } = gameManager.createGame(ws);
            if (status == "pending") {
                ws.send(JSON.stringify({
                    type: main_1.Messages.INIT_GAME,
                    status: "pending",
                }));
            }
            else if (status == "ready") {
                if (game == undefined) {
                    ws.send(JSON.stringify({
                        type: main_1.Messages.INIT_GAME,
                        status: "error",
                        message: "Game not found",
                    }));
                    return;
                }
                game.player1.send(JSON.stringify({
                    type: main_1.Messages.INIT_GAME,
                    status: "ready",
                    player: 1,
                    gameId: game.id,
                }));
                game.player2.send(JSON.stringify({
                    type: main_1.Messages.INIT_GAME,
                    status: "ready",
                    player: 2,
                    gameId: game.id,
                }));
            }
        }
        else if (message.type == main_1.Messages.MOVE) {
            const { gameId, row, col } = message;
            const game = gameManager.getGame(gameId);
            if (game == undefined) {
                ws.send(JSON.stringify({
                    type: main_1.Messages.MOVE,
                    status: "error",
                    message: "Game not found",
                }));
                return;
            }
            gameManager.makeMove(gameId, ws, row, col);
        }
    });
    ws.send("something");
});
