import { X, Circle } from 'lucide-react';

interface GameBoardProps {
  board: string[][];
  onMove: (row: number, col: number) => void;
  winner: number | null;
}

export function GameBoard({ board, onMove,winner }: GameBoardProps) {
  const handleClick = (row: number, col: number) => {
    if (board[row][col] === '') {
      onMove(row, col);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full aspect-square">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
            <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => !winner && handleClick(rowIndex, colIndex)}
            className={`bg-gray-100 aspect-square rounded flex items-center justify-center hover:bg-gray-200 transition-colors ${winner ? 'cursor-not-allowed ' : 'cursor-pointer'}`}
            disabled={!!winner}
            >
            {cell === 'X' ? (
              <X className="w-8 h-8 text-blue-500" />
            ) : cell === 'O' ? (
              <Circle className="w-8 h-8 text-red-500" />
            ) : null}
            </button>
        ))
      )}
    </div>
  );
}