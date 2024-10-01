// utils/sudokuGenerator.js

function generateSudoku() {
  const puzzle = Array(9)
    .fill()
    .map(() => Array(9).fill(0));
  const solution = Array(9)
    .fill()
    .map(() => Array(9).fill(0));

  // Fill diagonal boxes
  fillBox(puzzle, 0, 0);
  fillBox(puzzle, 3, 3);
  fillBox(puzzle, 6, 6);

  // Solve the rest
  solveSudoku(puzzle);

  // Copy the solved puzzle to the solution
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      solution[i][j] = puzzle[i][j];
    }
  }

  // Remove some numbers to create the puzzle
  const numToRemove = 40; // Adjust for difficulty
  for (let i = 0; i < numToRemove; i++) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    puzzle[row][col] = 0;
  }

  return { puzzle, solution };
}

function fillBox(board, row, col) {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let idx = Math.floor(Math.random() * nums.length);
      board[row + i][col + j] = nums[idx];
      nums.splice(idx, 1);
    }
  }
}

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            } else {
              board[row][col] = 0;
            }
          }
        }
        return false;
      }
    }
  }
  return true;
}

function isValid(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }
  let startRow = row - (row % 3),
    startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
}

module.exports = { generateSudoku };
