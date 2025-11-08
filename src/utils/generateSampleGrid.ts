import type { CellType } from "../components/Game";

// Генерація початкових даних
export const generateSampleGrid = (gridHeight: number, gridWidth: number) => {
  const grid: boolean[][] = [];

  for (let i = 0; i < gridHeight * 2 - 1; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < gridWidth; j++) {
      if (i % 2 === 0 && j === gridWidth - 1) break;
      row.push(false);
    }
    grid.push(row);
  }

  return grid;
};

export const generateSampleCellsGrid = (
  gridHeight: number,
  gridWidth: number
) => {
  const grid: CellType[][] = [];

  for (let i = 0; i < gridHeight; i++) {
    const row: CellType[] = [];
    for (let j = 0; j < gridWidth; j++) {
      row.push(-1);
    }
    grid.push(row);
  }

  return grid;
};

export const checkLineFill = (
  grid: boolean[][],
  row: number,
  col: number,
  type: "vertical" | "horizontal" | "cell"
): boolean | undefined => {
  if (type === "horizontal") {
    // рендер-рядок 2 -> грід-рядок 1, колонки 1,3,5 -> в грі 0,1,2
    return grid?.[row - 1]?.[(col + 1) / 2 - 1];
  } else if (type === "vertical") {
    // рендер-рядок 1,3,5 -> в грі 0,2,4 (ти вже так робиш при кліку, ставиш row-1)
    // а колонки 2,4 -> в грі 0,1 => col / 2 - 1
    return grid?.[row - 1]?.[col / 2 - 1];
  } else {
    const localRow = row - 1;
    const localCol = (col + 1) / 2 - 1;
    return grid?.[localRow]?.[localCol];
  }
};

export const checkIsFilledLine = (
  grid: boolean[][],
  row: number,
  col: number,
  type: "vertical" | "horizontal"
) => {
  const result = checkLineFill(grid, row, col, type);
  return result === false || result === undefined ? false : true;
};

export const fillNewLine = (
  grid: boolean[][],
  cellsGrid: CellType[][],
  rowLine: number,
  colLine: number,
  player: 1 | 2
) => {
  // робимо копію, щоб не мутувати React-стан напряму
  const newGrid = structuredClone(grid);
  // фарбуємо ту лінію, по якій клікнули
  newGrid[rowLine][colLine] = true;

  // шукаємо нові замкнені клітинки + одразу добиваємо всі внутрішні лінії
  const { cellsGrid: closedCellsBool, grid: gridWithAutofill } = checkNewCells(
    newGrid,
    cellsGrid
  );

  // тепер ставимо власника там, де закрилося
  const adjustedCellsGrid = adjustCellsGrid(closedCellsBool, cellsGrid, player);

  return { cellsGrid: adjustedCellsGrid, grid: gridWithAutofill };
};

// ----------------------------------------------------
// головна функція пошуку закритих прямокутників
// тепер вона повертає і boolean[][], і ОНОВЛЕНИЙ grid
// ----------------------------------------------------
const checkNewCells = (
  grid: boolean[][],
  cellsGrid: CellType[][]
): { cellsGrid: boolean[][]; grid: boolean[][] } => {
  const rows = cellsGrid.length;
  const cols = cellsGrid[0].length;

  const result = Array.from({ length: rows }, () => Array(cols).fill(false));
  // будемо мутувати копію гріда
  const updatedGrid = structuredClone(grid);

  const hasVertical = (cellRow: number, col: number): boolean => {
    return updatedGrid[cellRow * 2][col];
  };

  const hasHorizontal = (cellRow: number, col: number): boolean => {
    return updatedGrid[cellRow * 2 + 1][col];
  };

  for (let top = 0; top < rows; top++) {
    for (let left = 0; left < cols; left++) {
      for (let bottom = top; bottom < rows; bottom++) {
        for (let right = left; right < cols; right++) {
          let ok = true;

          // 1) ліва сторона
          for (let r = top; r <= bottom; r++) {
            if (left > 0 && !hasVertical(r, left - 1)) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          // 2) права сторона
          for (let r = top; r <= bottom; r++) {
            if (right < cols - 1 && !hasVertical(r, right)) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          // 3) верхня сторона
          for (let c = left; c <= right; c++) {
            if (top > 0 && !hasHorizontal(top - 1, c)) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          // 4) нижня сторона
          for (let c = left; c <= right; c++) {
            if (bottom < rows - 1 && !hasHorizontal(bottom, c)) {
              ok = false;
              break;
            }
          }
          if (!ok) continue;

          // 5) всередині не повинно бути інших ліній, які ріжуть
          let hasInner = false;

          // внутрішні вертикальні
          for (let r = top; r <= bottom && !hasInner; r++) {
            for (let v = left; v < right; v++) {
              const isLeftPerim = left > 0 && v === left - 1;
              const isRightPerim = right < cols - 1 && v === right;
              if (isLeftPerim || isRightPerim) continue;

              if (hasVertical(r, v)) {
                hasInner = true;
                break;
              }
            }
          }

          // внутрішні горизонтальні
          if (!hasInner) {
            for (let h = top; h < bottom && !hasInner; h++) {
              for (let c = left; c <= right; c++) {
                const isTopPerim = top > 0 && h === top - 1;
                const isBottomPerim = bottom < rows - 1 && h === bottom;
                if (isTopPerim || isBottomPerim) continue;

                if (hasHorizontal(h, c)) {
                  hasInner = true;
                  break;
                }
              }
            }
          }

          if (hasInner) continue;

          // якщо ми сюди дійшли — прямокутник цільний ✅
          // 1) позначаємо всі клітинки
          for (let r = top; r <= bottom; r++) {
            for (let c = left; c <= right; c++) {
              result[r][c] = true;
            }
          }

          // 2) і ТУТ головне: фарбуємо всі лінії всередині цього прямокутника
          // 2.1 периметр вертикальний
          for (let r = top; r <= bottom; r++) {
            // ліва межа
            if (left > 0) {
              updatedGrid[r * 2][left - 1] = true;
            }
            // права межа
            if (right < cols - 1) {
              updatedGrid[r * 2][right] = true;
            }
          }

          // 2.2 периметр горизонтальний
          for (let c = left; c <= right; c++) {
            // верхня межа
            if (top > 0) {
              updatedGrid[top * 2 - 1][c] = true;
            }
            // нижня межа
            if (bottom < rows - 1) {
              updatedGrid[bottom * 2 + 1][c] = true;
            }
          }

          // 2.3 ВСІ внутрішні вертикалі між left..right
          // якщо прямокутник ширший за 1 клітинку
          for (let r = top; r <= bottom; r++) {
            for (let v = left; v < right; v++) {
              // ця вертикаль знаходиться в рядку r*2 і колонці v
              updatedGrid[r * 2][v] = true;
            }
          }

          // 2.4 ВСІ внутрішні горизонталі між top..bottom
          for (let h = top; h < bottom; h++) {
            for (let c = left; c <= right; c++) {
              // горизонталь між h і h+1 → рядок h*2+1
              updatedGrid[h * 2 + 1][c] = true;
            }
          }
        }
      }
    }
  }

  return { cellsGrid: result, grid: updatedGrid };
};

// ----------------------------------------------------

const adjustCellsGrid = (
  newCellsGrid: boolean[][],
  cellsGrid: CellType[][],
  player: 1 | 2
): CellType[][] => {
  const updated = structuredClone(cellsGrid);

  for (let i = 0; i < updated.length; i++) {
    for (let j = 0; j < updated[i].length; j++) {
      if (newCellsGrid[i][j] && updated[i][j] === -1) {
        updated[i][j] = player;
      }
    }
  }

  return updated;
};

/*

 - - - - - -
| | | | | | |
 - - - - - -
| | | | | | |
 - - - - - -
| | | | | | |
 - - - - - -
| | | | | | |
 - - - - - -
| | | | | | |
 - - - - - -

*/

/*const checkNewCells = (
  grid: boolean[][],
  cellsGrid: CellType[][]
): boolean[][] => {
  const arr = new Array(cellsGrid.length)
    .fill(null)
    .map(() => new Array(cellsGrid[0].length).fill(false));

  const gridHeight = Math.ceil(grid.length / 2);
  const gridWidth = grid[0].length + 1;

  // vertical checking
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      const areWeFilled = j === 0 ? true : grid[i * 2][j - 1];
      if (!areWeFilled) continue;

      const isTopFilled = i === 0 ? true : grid[i * 2 + 1][j];
      if (!isTopFilled) continue;

      let immediateNotFilled = false;

      for (let k = 0; k < gridHeight - i - 1; k++) {
        if (immediateNotFilled) break;

        const isLocalTopFilled = true; // FIXME
        const isLocalRightFilled = true; // FIXME

        if (!isLocalTopFilled) {
          immediateNotFilled = true;
        }

        if (isLocalRightFilled) {
          for (let l = 0; l < gridWidth - j - 1; l++) {
            const isLocalLeftFilled = true; // FIXME
            const isLocalBottomFilled = true; // FIXME

            if (!isLocalLeftFilled) {
              immediateNotFilled = true;
            }

            if (isLocalBottomFilled) {
              for (let m = 1; m < l + 1; m++) {
                const isLocalLineFilled = true; // FIXME

                if (!isLocalLineFilled) {
                  immediateNotFilled = true;
                }
              }

              for (let m = 1; m < k + 1; m++) {
                const isLocalLineFilled = true; // FIXME

                if (!isLocalLineFilled) {
                  immediateNotFilled = true;
                }
              }

              for (let m = 1; m < k + 1; m++) {
                for (let n = 1; n < l + 1; n++) {
                  const isInsideFilled = true;

                  if (isInsideFilled) {
                    immediateNotFilled = true;
                  }
                }
              }
            }
          }
        }

        if (immediateNotFilled) break;
      }
    }
  }

  return arr;
};
 */

// const checkForFilledCell = (
//   grid: boolean[][],
//   row: number,
//   col: number
// ): boolean => {
//   const top = checkLineFill(grid, row - 1, col, "cell");
//   const right = checkLineFill(grid, row, col, "cell");
//   const bottom = checkLineFill(grid, row + 1, col, "cell");
//   const left = checkLineFill(grid, row, col - 2, "cell");

//   return checkForClosedCell(top, right, bottom, left);
// };

// const checkForClosedCell = (
//   top: boolean | undefined,
//   right: boolean | undefined,
//   bottom: boolean | undefined,
//   left: boolean | undefined
// ) => {
//   return top !== false && right !== false && bottom !== false && left !== false;
// };
