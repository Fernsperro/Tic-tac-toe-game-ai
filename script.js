const boardEl = document.getElementById("board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let board = Array(9).fill(null);
let human = "X";
let ai = "O";
let currentPlayer = human;

// Draw board
function drawBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    if (cell) {
      div.textContent = cell;
      div.classList.add("taken");
    } else {
      div.addEventListener("click", () => playerMove(i));
    }
    boardEl.appendChild(div);
  });
}

function playerMove(index) {
  if (board[index] || checkWinner(board)) return;

  board[index] = human;
  drawBoard();

  if (!checkWinner(board) && !board.includes(null)) {
    message.textContent = "Draw!";
    return;
  }

  setTimeout(() => {
    let bestMove = getBestMove(board);
    board[bestMove] = ai;
    drawBoard();
    if (checkWinner(board)) {
      message.textContent = "You lost!";
    } else if (!board.includes(null)) {
      message.textContent = "Draw!";
    }
  }, 300);
}

function getBestMove(newBoard) {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (!newBoard[i]) {
      newBoard[i] = ai;
      let score = minimax(newBoard, 0, false);
      newBoard[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(boardState, depth, isMaximizing) {
  let result = checkWinner(boardState);
  if (result === ai) return 10 - depth;
  if (result === human) return depth - 10;
  if (!boardState.includes(null)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = ai;
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!boardState[i]) {
        boardState[i] = human;
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = null;
      }
    }
    return best;
  }
}

function checkWinner(b) {
  const winCombs = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (const [a, b1, c] of winCombs) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return null;
}

restartBtn.addEventListener("click", () => {
  board = Array(9).fill(null);
  currentPlayer = human;
  message.textContent = "";
  drawBoard();
});

drawBoard();
