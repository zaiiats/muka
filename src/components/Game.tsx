import { useState } from "react";
import styled from "styled-components";
import Grid from "./Grid";
import Top from "./Top";
import { generateSampleCellsGrid } from "../utils/generateSampleGrid";

export type CellType = 1 | 2 | -1;

const StyledWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 1fr;
  grid-template-rows: 4rem 1fr;
`;

export default function Game({
  setIsStarted,
  grid,
  gridHeight,
  gridWidth,
  setGrid,
}: {
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
  grid: boolean[][];
  gridHeight: number;
  gridWidth: number;
  setGrid: React.Dispatch<React.SetStateAction<boolean[][]>>;
}) {
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [cellsGrid, setCellsGrid] = useState<CellType[][]>(() =>
    generateSampleCellsGrid(gridHeight, gridWidth)
  );

  return (
    <StyledWrapper>
      <Top
        setIsStarted={setIsStarted}
        currentPlayer={currentPlayer}
        cellsGrid={cellsGrid}
      />
      <Grid
        setIsStarted={setIsStarted}
        grid={grid}
        setGrid={setGrid}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        cellsGrid={cellsGrid}
        setCellsGrid={setCellsGrid}
        gridHeight={gridHeight}
        gridWidth={gridWidth}
      />
    </StyledWrapper>
  );
}
