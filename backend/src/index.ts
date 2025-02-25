import { WebSocketServer } from 'ws';
import { Messages } from './types/main';
import GameManager from './GameManager';

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const message = JSON.parse(data.toString());

    if(message.type == Messages.INIT_GAME){
        const {status, game} = gameManager.createGame(ws);
    }
    else if(message.type == Messages.MOVE){
    
    }
  });

  ws.send('something');
});