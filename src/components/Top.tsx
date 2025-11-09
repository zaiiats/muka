import styled from "styled-components";
import Timer from "./Timer";
import type { CellType } from "./Game";

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
`;

const PlayerScore = styled.div<{ $active?: boolean; $winner?: boolean; $color?: string }>`
  display: flex;
  padding: 0 1rem;
  background: ${({ $winner, $color, $active }) => {
    if ($winner && $color) return $color;
    return $active ? "#ff9a9a" : "#ffd2d2";
  }};
  justify-content: center;
  align-items: center;
  height: 2rem;
`;

const BackButton = styled.button<{ $color?: string }>`
  height: 2rem;
  padding: 0 0.5rem;
  background-color: ${({ $color }) => $color ?? "#ffd2d2"};
  justify-content: center;
  align-items: center;
`;

export default function Top({
  setIsStarted,
  currentPlayer,
  cellsGrid,
  gridHeight,
  gridWidth,
}: {
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
  currentPlayer: 1 | 2;
  cellsGrid: CellType[][];
  gridHeight: number;
  gridWidth: number;
}) {
  const firstPlayerScore = cellsGrid.flat().reduce((acc, cur) => {
    return cur === 1 ? acc + 1 : acc;
  }, 0);

  const secondPlayerScore = cellsGrid.flat().reduce((acc, cur) => {
    return cur === 2 ? acc + 1 : acc;
  }, 0);

  const isEnded =
    firstPlayerScore + secondPlayerScore >= gridHeight * gridWidth;

  // визначаємо переможця
  let winner: 1 | 2 | null = null;
  if (isEnded) {
    if (firstPlayerScore > secondPlayerScore) winner = 1;
    else if (secondPlayerScore > firstPlayerScore) winner = 2;
    else winner = null; // нічия
  }

  console.log(isEnded);
  

  // кольори як у клітинок
  const X_COLOR = "#ec6969";
  const O_COLOR = "#5875e8";

  const backButtonColor =
    winner === 1 ? X_COLOR : winner === 2 ? O_COLOR : "#ffd2d2";

  return (
    <StyledWrapper>
      <BackButton onClick={() => setIsStarted(false)} $color={backButtonColor}>
        {"<-"}
      </BackButton>

      <PlayerScore
        $active={!isEnded && currentPlayer === 1}
        $winner={winner === 1}
        $color={winner === 1 ? X_COLOR : undefined}
      >
        X - {firstPlayerScore} очк.
      </PlayerScore>

      <PlayerScore
        $active={!isEnded && currentPlayer === 2}
        $winner={winner === 2}
        $color={winner === 2 ? O_COLOR : undefined}
      >
        O - {secondPlayerScore} очк.
      </PlayerScore>

      {/* таймер не показуємо коли гра закінчена */}
      {!isEnded && <Timer />}
    </StyledWrapper>
  );
}
