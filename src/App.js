import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), lastMove: null, player: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, moveIndex) {
    const player = xIsNext ? "X" : "O";
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, lastMove: moveIndex, player },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const { lastMove, player } = step;
    const row = lastMove !== null ? Math.floor(lastMove / 3) + 1 : null;
    const col = lastMove !== null ? (lastMove % 3) + 1 : null;
    const location = lastMove !== null ? `(${row}, ${col})` : "";
    const playerInfo = player ? ` - ${player}` : "";

    if (move === currentMove) {
      return (
        <li key={move}>
          You are at move #{move} {location}
          {playerInfo}
        </li>
      );
    }
    let description =
      move > 0
        ? `Go to move #${move} ${location}${playerInfo}`
        : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? "Sort Descending" : "Sort Ascending"}
        </button>
        <ol>{isAscending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)?.winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i);
  }

  const winnerData = calculateWinner(squares);
  let status;
  if (winnerData) {
    status = "Winner: " + winnerData.winner;
  } else if (!squares.includes(null)) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div key={row} className="board-row">
            {Array(3)
              .fill(null)
              .map((_, col) => {
                const index = row * 3 + col;
                const isWinningSquare = winnerData?.line.includes(index);
                return (
                  <Square
                    key={index}
                    value={squares[index]}
                    onSquareClick={() => handleClick(index)}
                    isWinningSquare={isWinningSquare}
                  />
                );
              })}
          </div>
        ))}
    </>
  );
}

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{
        color: value === "X" ? "blue" : value === "O" ? "red" : "black",
        backgroundColor: isWinningSquare ? "yellow" : "white",
      }}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
