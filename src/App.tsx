import { useState } from "react";
import Hello from "./components/Hello";
import Game from "./components/Game";
import styled from "styled-components";

const StyledApp = styled.div`
  width: 100vw;
  height: 100dvh;
  background-color: #f4fdff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Pixelify Sans", sans-serif;
`;

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [gridHeight, setGridHeight] = useState(9);
  const [gridWidth, setGridWidth] = useState(9);

  const [grid, setGrid] = useState<boolean[][]>([]);

  return (
    <StyledApp>
      {isStarted ? (
        <Game
          setIsStarted={setIsStarted}
          grid={grid}
          setGrid={setGrid}
          gridHeight={gridHeight}
          gridWidth={gridWidth}
        />
      ) : (
        <Hello
          gridHeight={gridHeight}
          gridWidth={gridWidth}
          setGridHeight={setGridHeight}
          setGridWidth={setGridWidth}
          setIsStarting={setIsStarted}
        />
      )}
    </StyledApp>
  );
}

export default App;
