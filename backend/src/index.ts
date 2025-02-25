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

        if(game == undefined){
          ws.send(JSON.stringify({
            type: Messages.INIT_GAME,
            status: 'error',
            message: 'Game already exists'
          }));
        }
        else if(status == 'pending'){
          ws.send(JSON.stringify({
            type: Messages.INIT_GAME,
            status: 'pending'
          }));
        }
        else if(status == 'ready'){
          game.player1.send(JSON.stringify({
            type: Messages.INIT_GAME,
            status: 'ready',
            player: 1
          }));

          game.player2.send(JSON.stringify({
            type: Messages.INIT_GAME,
            status: 'ready',
            player: 2
          }));  
        }
    }
    else if(message.type == Messages.MOVE){
      
    }
  });

  ws.send('something');
});