// script.js

const gameBoard = document.getElementById("game-board");
const gameStatus = document.getElementById("game-status");
const resetButton = document.getElementById("reset-button");

let currentPlayer = "X";
let board = Array(9).fill(null);
let isGameOver = false;

// Initialize the board
function initializeBoard() {
  gameBoard.innerHTML = "";
  board = Array(9).fill(null);
  isGameOver = false;
  currentPlayer = "X";
  gameStatus.textContent = "Player X's turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    gameBoard.appendChild(cell);
  }
}

// Handle player move
function handleMove(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (board[index] || isGameOver) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner()) {
    gameStatus.textContent = `Player ${currentPlayer} wins!`;
    isGameOver = true;
    return;
  }

  if (board.every(cell => cell)) {
    gameStatus.textContent = "It's a tie!";
    isGameOver = true;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

// Check for a winner
function checkWinner() {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]            // Diagonals
  ];

  return winningCombos.some(combo => {
    const [a, b, c] = combo;
    return board[a] && board[a] === board[b] && board[b] === board[c];
  });
}

// Reset the game
resetButton.addEventListener("click", initializeBoard);

// Start the game
initializeBoard();
