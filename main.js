import * as Helpers from './helpers';

const createRandomPosition = (boardWidth) => {
  return Math.floor(Math.random() * boardWidth);
};

const checkForMine = (x, y, mines) => {
  return mines.some((mine) => mine.x === x && mine.y === y);
};

const createCellElement = (i, j, state) => {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.addEventListener('click', () => {
    Helpers.handleCellClick(j, i, state);
  });
  cell.addEventListener('contextmenu', (e) => {
    Helpers.handleMarkCell(e, j, i, state);
  });
  return cell;
};

const createMineArray = (boardWidth) => {
  const mines = [];
  for (let i = 0; i < boardWidth; i++) {
    let x = 1;
    let y = 1;
    do {
      x = createRandomPosition(boardWidth);
      y = createRandomPosition(boardWidth);
    } while (checkForMine(x, y, mines));
    mines.push({ x, y });
  }
  return mines;
};

const resetElements = (board) => {
  document.querySelector('button').style.display = 'none';
  document.querySelector('#game-state').innerText = '';
  document.querySelector('#mines-marked').innerText = '0';
  Array.from(board.childNodes).forEach((node) => node.remove());
};

const createState = () => {
  const boardWidth = document.querySelector('#board-width').value;
  const board = document.querySelector('.board');
  resetElements(board);
  const cellState = [];
  const state = {
    playing: true,
    cellState,
  };
  const mines = createMineArray(boardWidth);
  for (let i = 0; i < boardWidth; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    const cellStateRow = [];
    for (let j = 0; j < boardWidth; j++) {
      const cell = createCellElement(i, j, state);
      row.appendChild(cell);
      cellStateRow.push({
        clicked: false,
        isMine: checkForMine(j, i, mines),
        marked: false,
        element: cell,
      });
      row.appendChild(cell);
    }
    board.appendChild(row);
    cellState.push(cellStateRow);
  }
};

createState();
document.querySelector('#board-width').addEventListener('change', createState);
document.querySelector('button').addEventListener('click', createState);
