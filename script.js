// script.js

const gameBoard = document.getElementById("game-board");
const gameStatus = document.getElementById("game-status");
const resetButton = document.getElementById("reset-button");
const pvpModeButton = document.getElementById("pvp-mode");
const pvcModeButton = document.getElementById("pvc-mode");

const playerXScore = document.getElementById("player-x-score");
const playerOScore = document.getElementById("player-o-score");
const drawScore = document.getElementById("draw-score");

let currentPlayer = "X";
let board = Array(9).fill(null);
let isGameOver = false;
let gameMode = null; 
let scores = { X: 0, O: 0, draw: 0 };

function initializeBoard() {
  gameBoard.innerHTML = "";
  board = Array(9).fill(null);
  isGameOver = false;
  currentPlayer = "X";
  updateGameStatus(`${currentPlayer}'s turn`);

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    gameBoard.appendChild(cell);
  }

  resetButton.disabled = false;
}

// Update the game status
function updateGameStatus(message) {
  gameStatus.textContent = message;
}

// Handle player move
function handleMove(e) {
  if (isGameOver || gameMode === null) return;

  const cell = e.target;
  const index = cell.dataset.index;

  if (board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner()) {
    updateGameStatus(`${currentPlayer} wins!`);
    isGameOver = true;
    scores[currentPlayer]++;
    updateScores();
    return;
  }

  if (board.every(cell => cell)) {
    updateGameStatus("It's a draw!");
    isGameOver = true;
    scores.draw++;
    updateScores();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateGameStatus(`${currentPlayer}'s turn`);

  if (gameMode === "pvc" && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
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

// AI makes a move
function aiMove() {
  let emptyCells = board.map((val, idx) => (val === null ? idx : null)).filter(idx => idx !== null);

  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";

  const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
  cell.textContent = "O";
  cell.classList.add("taken");

  if (checkWinner()) {
    updateGameStatus("O wins!");
    isGameOver = true;
    scores["O"]++;
    updateScores();
    return;
  }

  if (board.every(cell => cell)) {
    updateGameStatus("It's a draw!");
    isGameOver = true;
    scores.draw++;
    updateScores();
    return;
  }

  currentPlayer = "X";
  updateGameStatus("X's turn");
}

function updateScores() {
  playerXScore.textContent = `X: ${scores.X}`;
  playerOScore.textContent = `O: ${scores.O}`;
  drawScore.textContent = `Draws: ${scores.draw}`;
}

// Reset the game
resetButton.addEventListener("click", initializeBoard);

// Set game mode
pvpModeButton.addEventListener("click", () => {
  gameMode = "pvp";
  initializeBoard();
  updateGameStatus("Player X's turn");
});

pvcModeButton.addEventListener("click", () => {
  gameMode = "pvc";
  initializeBoard();
  updateGameStatus("Player X's turn");
});
