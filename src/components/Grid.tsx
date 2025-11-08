import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { checkIsFilledLine, fillNewLine } from "../utils/generateSampleGrid";
import type { CellType } from "./Game";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  width: 100%;
  height: 100%;
  padding: 1rem;
  overflow: hidden;
`;

const Dot = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 9999px;
`;

const HorizontalLine = styled.div`
  width: 100%;
  height: 16px;
  background: #ccc;
  align-self: center;
  justify-self: stretch;
`;

const HorizontalLineFilled = styled(HorizontalLine)`
  background: #000;
`;

const VerticalLine = styled.div`
  width: 16px;
  height: 100%;
  background: #ccc;
  justify-self: center;
  align-self: stretch;
`;

const VerticalLineFilled = styled(VerticalLine)`
  background: #000;
`;

const Cell = styled.div`
  background: #fff;
`;

const CellX = styled(Cell)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const CellO = styled(CellX)``;

const HorizontalLineBorder = styled(HorizontalLine)`
  background: #000; /* рамка зверху/знизу завжди чорна */
`;

const VerticalLineBorder = styled(VerticalLine)`
  background: #000;
`;

const GridContainer = styled.div<{
  $gridRows: string;
  $gridColumns: string;
  $size?: number;
}>`
  display: grid;
  grid-template-rows: ${({ $gridRows }) => $gridRows};
  grid-template-columns: ${({ $gridColumns }) => $gridColumns};

  ${({ $size }) =>
    $size
      ? `
    width: ${$size}px;
    height: ${$size}px;
  `
      : `
    width: 100%;
    height: 100%;
  `}
`;

export default function Grid({
  grid,
  currentPlayer,
  setCurrentPlayer,
  cellsGrid,
  setCellsGrid,
  gridHeight,
  gridWidth,
  setGrid,
}: {
  grid: boolean[][];
  currentPlayer: 1 | 2;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<1 | 2>>;
  cellsGrid: CellType[][];
  setCellsGrid: React.Dispatch<React.SetStateAction<CellType[][]>>;
  gridHeight: number;
  gridWidth: number;
  setGrid: React.Dispatch<React.SetStateAction<boolean[][]>>;
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (containerRef.current) {
      const h = containerRef.current.offsetHeight - 16;
      const w = containerRef.current.offsetWidth - 16;
      const min = Math.min(h, w);
      setSize(min);
    }
  }, []);

  const gridContent = generateGridContent(
    grid,
    cellsGrid,
    gridHeight,
    gridWidth,
    size
  );

  const handleLineClick = ({ row, col }: { row: number; col: number }) => {
    console.log(row, col);

    const { cellsGrid: nextCellsGrid, grid: nextGrid } = fillNewLine(
      grid,
      cellsGrid,
      row,
      col,
      currentPlayer
    );

    setCellsGrid(nextCellsGrid);
    setGrid(nextGrid);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const firstPlayerScore = cellsGrid.flat().reduce((acc, cur) => {
    return cur === 1 ? acc + 1 : acc;
  }, 0);

  const secondPlayerScore = cellsGrid.flat().reduce((acc, cur) => {
    return cur === 2 ? acc + 1 : acc;
  }, 0);

  const isEnded =
    firstPlayerScore + secondPlayerScore >= gridHeight * gridWidth;

  return (
    <StyledWrapper ref={containerRef}>
      {isEnded ? (
        <p>
          Переміг: {" "}
          {firstPlayerScore > secondPlayerScore
            ? 'X'
            : 'O'}
        </p>
      ) : (
        <GridContainer
          $size={size}
          $gridColumns={getGridString(gridWidth)}
          $gridRows={getGridString(gridHeight)}
        >
          {gridContent.map((item, idx) => {
            if (item === "dot") return <Dot key={idx} />;
            if (item === "horizontalLineBorder")
              return <HorizontalLineBorder key={idx} />;
            if (item === "verticalLineBorder")
              return <VerticalLineBorder key={idx} />;

            if (typeof item === "string") {
              if (item === "emptyCell") return <Cell key={idx} />;
              if (item === "xCell") return <CellX key={idx}>X</CellX>;
              if (item === "oCell") return <CellO key={idx}>O</CellO>;
            } else {
              if (item.name === "horizontalLine")
                return (
                  <HorizontalLine
                    onClick={() =>
                      handleLineClick({ row: item.row, col: item.col })
                    }
                    key={idx}
                  />
                );
              if (item.name === "horizontalLineFilled")
                return <HorizontalLineFilled key={idx} />;
              if (item.name === "verticalLine")
                return (
                  <VerticalLine
                    onClick={() => {
                      console.log(2);

                      handleLineClick({ row: item.row, col: item.col });
                    }}
                    key={idx}
                  />
                );
              if (item.name === "verticalLineFilled")
                return <VerticalLineFilled key={idx} />;
            }

            return <div key={idx} />;
          })}
        </GridContainer>
      )}
    </StyledWrapper>
  );
}

const getGridString = (axis: number) => {
  let text = "";
  for (let i = 0; i < axis; i++) {
    text += "auto 1fr ";
  }
  text += "auto";
  console.log(text);
  return text;
};

const generateGridContent = (
  grid: boolean[][],
  cellsGrid: CellType[][],
  gridHeight: number,
  gridWidth: number,
  size?: number
) => {
  if (!size) return [];

  const gridContent: Array<
    | "dot"
    | "horizontalLine"
    | "horizontalLineBorder"
    | "horizontalLineFilled"
    | "verticalLine"
    | "verticalLineBorder"
    | "verticalLineFilled"
    | "emptyCell"
    | "xCell"
    | "oCell"
    | { name: string; row: number; col: number }
  > = [];

  const gridHeightAdjusted = gridHeight * 2 + 1;
  const gridWidthAdjusted = gridWidth * 2 + 1;
  const start = Date.now();

  for (let i = 0; i < gridHeightAdjusted * gridWidthAdjusted; i++) {
    const row = Math.floor(i / gridWidthAdjusted);
    const col = i % gridWidthAdjusted;

    const isDotRow = row % 2 === 0;
    const isDotCol = col % 2 === 0;

    if (isDotRow) {
      // ряд з крапок і горизонтальних ліній
      if (isDotCol) {
        gridContent.push("dot");
      } else {
        if (row === 0 || row === gridHeightAdjusted - 1) {
          gridContent.push("horizontalLineBorder");
        } else {
          const isFilled = checkIsFilledLine(grid, row, col, "horizontal");
          gridContent.push(
            isFilled
              ? { name: "horizontalLineFilled", row, col }
              : { name: "horizontalLine", row: row - 1, col: (col - 1) / 2 }
          );
        }
      }
    } else {
      // ряд з вертикалями і клітинками
      if (isDotCol) {
        if (col === 0 || col === gridWidthAdjusted - 1) {
          gridContent.push("verticalLineBorder");
        } else {
          const isFilled = checkIsFilledLine(grid, row, col, "vertical");
          gridContent.push(
            isFilled
              ? { name: "verticalLineFilled", row, col }
              : { name: "verticalLine", row: row - 1, col: col / 2 - 1 }
          );
        }
      } else {
        const cellRow = Math.floor(row / 2);
        const cellCol = Math.floor(col / 2);
        const filled = cellsGrid[cellRow][cellCol];

        if (filled === -1) {
          gridContent.push("emptyCell");
        } else if (filled === 1) {
          gridContent.push("xCell");
        } else {
          gridContent.push("oCell");
        }
      }
    }
  }

  console.log("generated in", Date.now() - start, "ms");
  return gridContent;
};
