const isBeside = (x, y, indexX, indexY) => {
  return (
    (Math.abs(x - indexX) === 1 && Math.abs(y - indexY) === 0) ||
    (Math.abs(y - indexY) === 1 && Math.abs(x - indexX) === 0) ||
    (Math.abs(x - indexX) === 1 && Math.abs(y - indexY) === 1)
  );
};

const countAdjacentMines = (x, y, state) => {
  let count = 0;
  state.cellState.forEach((row, indexY) => {
    row.forEach((cell, indexX) => {
      if (cell.isMine && isBeside(x, y, indexX, indexY)) {
        count++;
      }
    });
  });
  return count;
};

const loseGame = (state) => {
  setGameState('You Lose');
  state.cellState.forEach((row) => {
    row.forEach((cell) => {
      cell.element.classList.remove('marked');
      if (cell.isMine) cell.element.style.backgroundColor = 'red';
    });
  });
  endGame(state);
};

const checkForWin = (state) => {
  let win = true;
  state.cellState.forEach((row) => {
    row.forEach((cell) => {
      if (!cell.isMine && !cell.clicked) win = false;
    });
  });
  if (!win) return;
  setGameState('You Win 🚀');
  endGame(state);
};

const endGame = (state) => {
  state.playing = false;
  document.querySelector('button').style.display = 'block';
};

const setGameState = (state) => {
  document.querySelector('#game-state').innerText = state;
};

const clearSurrounding = (x, y, state) => {
  state.cellState.forEach((row, indexY) => {
    row.forEach((cell, indexX) => {
      if (isBeside(x, y, indexX, indexY))
        handleCellClick(indexX, indexY, state);
    });
  });
};

export const handleMarkCell = (e, x, y, state) => {
  e.preventDefault();
  const cellState = state.cellState[y][x];
  if (cellState.clicked || !state.playing) return;
  const minesMarkedCount = parseInt(
    document.querySelector('#mines-marked').innerText
  );
  const newMinesMarkedCount = cellState.marked
    ? minesMarkedCount - 1
    : minesMarkedCount + 1;
  document.querySelector('#mines-marked').innerText = newMinesMarkedCount;
  e.target.classList.toggle('marked');
  cellState.marked = !cellState.marked;
};

export const handleCellClick = (x, y, state) => {
  const cellState = state.cellState[y][x];
  const cell = cellState.element;
  if (cellState.clicked || cellState.marked || !state.playing) return;
  cellState.clicked = true;
  cell.style.backgroundColor = 'darkgrey';
  if (cellState.isMine) {
    cell.style.backgroundColor = 'red';
    loseGame(state);
    return;
  }
  const adjacentMineCount = countAdjacentMines(x, y, state);
  if (adjacentMineCount === 0) {
    clearSurrounding(x, y, state);
  } else {
    cell.innerText = adjacentMineCount;
  }
  checkForWin(state);
};
