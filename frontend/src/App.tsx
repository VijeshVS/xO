import { useState, useEffect, useCallback } from 'react';
import { X, Circle, Loader2 } from 'lucide-react';
import { GameBoard } from './components/GameBoard';
import { useWebSocket } from './hooks/useWebSocket';
import { Toaster, toast } from "react-hot-toast";
import confetti from 'canvas-confetti';

function App() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [player, setPlayer] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<'idle' | 'pending' | 'ready' | 'over'>('idle');
  const [winner, setWinner] = useState<number | null>(null);
  const [board, setBoard] = useState<string[][]>(Array(3).fill(null).map(() => Array(3).fill('')));
  const { socket, connected, connect } = useWebSocket('wss://xo-backend-igyn.onrender.com');

  const handlePlay = useCallback(() => {
    if (socket) {
      socket.send(JSON.stringify({ type: 'INIT_GAME' }));
      setGameStatus('pending');
      setBoard(Array(3).fill(null).map(() => Array(3).fill('')));
      setWinner(null);
    }
  }, [socket]);

  const handleMove = useCallback((row: number, col: number) => {
    if (socket && gameId) {
      socket.send(JSON.stringify({
        type: 'MOVE',
        gameId,
        row,
        col
      }));
    }
  }, [socket, gameId]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.status === 'pending') {
          setGameStatus('pending');
        } else if (data.status === 'ready') {
          setGameStatus('ready');
          setGameId(data.gameId);
          setPlayer(data.player);
        } else if (data.status === 'GAME_OVER') {
          setGameStatus('over');
          setWinner(data.winner);
          console.log("Bahaarrr")
          console.log(data.winner,player)
          // Trigger confetti when the player wins
          if (data.winner === player) {

            console.log("confettiiii")

            const duration = 2 * 1000; // 2 seconds
            const end = Date.now() + duration;
  
            (function frame() {
              confetti({
                particleCount: 5,
                spread: 70,
                origin: { y: 0.6 },
              });
  
              if (Date.now() < end) {
                requestAnimationFrame(frame);
              }
            })();
          }
        } else if (data.status === 'MOVE') {
          const [coords, symbol] = data.move.split('|');
          const [row, col] = coords.split(',').map(Number);
  
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((row) => [...row]);
            newBoard[row][col] = symbol;
            return newBoard;
          });
        } else if (data.status === 'error') {
          toast.error('Invalid move');
        }
      };
    }
  }, [socket, player]); // Ensure player is in the dependency array  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-8">Tic Tac Toe</h1>
        
        {!connected ? (
          <div className="text-center">
            <button
              onClick={connect}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Connect to Server
            </button>
          </div>
        ) : gameStatus === 'idle' ? (
          <div className="text-center">
            <button
              onClick={handlePlay}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Play Game
            </button>
          </div>
        ) : gameStatus === 'pending' ? (
          <div className="text-center">
            <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4" />
            <p className="text-gray-600">Waiting for opponent...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-lg font-medium">
                You are {player === 1 ? <X className="inline" /> : <Circle className="inline" />}
              </p>
            </div>
            <GameBoard board={board} onMove={handleMove} />
            {gameStatus === 'over' && (
              <div className="mt-4 text-center">
                <p className="text-xl font-bold">
                  {winner === 0 
                    ? "It's a draw!" 
                    : winner === player 
                      ? 'You won!' 
                      : 'You lost!'}
                </p>
                <button
                  onClick={handlePlay}
                  className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Toaster/>
    </div>
  );
}

export default App;