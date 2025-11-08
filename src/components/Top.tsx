import styled from "styled-components";
import Timer from "./Timer";
import type { CellType } from "./Game";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3vw;
`;

const PlayerScore = styled.div<{ $active?: boolean }>`
  display: flex;
  padding: 0 1rem;
  background: ${({ $active }) => ($active ? "#ff9a9a" : "#ffd2d2")};
  justify-content: center;
  align-items: center;
  height: 2rem;
`;

const BackButton = styled.button`
  height: 2rem;
  padding: 0 0.5rem;
  background-color: #ffd2d2;
  justify-content: center;
  align-items: center;
`;

export default function Top({
  setIsStarted,
  currentPlayer,
  cellsGrid,
}: {
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
  currentPlayer: 1 | 2;
  cellsGrid: CellType[][];
}) {
  const firstPlayerScore = cellsGrid.flat().reduce((acc, cur) => {
    return cur === 1 ? acc + 1 : acc;
  }, 0);

  const secondPlayerScore = cellsGrid.flat().reduce((acc, cur) => {
    return cur === 2 ? acc + 1 : acc;
  }, 0);

  return (
    <StyledWrapper>
      <BackButton onClick={() => setIsStarted(false)}>{"<-"}</BackButton>
      <PlayerScore $active={currentPlayer === 1}>
        X - {firstPlayerScore}
      </PlayerScore>
      <PlayerScore $active={currentPlayer === 2}>
        O - {secondPlayerScore}
      </PlayerScore>

      <Timer />
    </StyledWrapper>
  );
}
