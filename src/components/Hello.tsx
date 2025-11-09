import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const P = styled.p`
  margin: 0;
  font-size: 2rem;
  font-weight: 500;
`;

const ConfigGridButtons = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
`;

const GridButton = styled.button<{ selected?: boolean }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  background: ${({ selected }) => (selected ? "#2563eb" : "#3b82f6")};
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: scale(1.05);
  }
`;

const ButtonStart = styled.button`
  padding: 1rem 4rem;
  border: none;
  background: #f36a6a;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  transition: 0.15s;
  border-radius: 10px;

  &:hover {
    transform: scale(1.05);
  }
`;

export default function Hello({
  gridHeight,
  gridWidth,
  setGridHeight,
  setGridWidth,
  setIsStarting,
}: {
  gridHeight: number;
  gridWidth: number;
  setGridHeight: (height: number) => void;
  setGridWidth: (width: number) => void;
  setIsStarting: (isStarting: boolean) => void;
}) {
  const options = [
    { w: 5, h: 5 },
    { w: 9, h: 9 },
    { w: 13, h: 13 },
  ];

  const handleSelect = (w: number, h: number) => {
    setGridWidth(w);
    setGridHeight(h);
  };

  return (
    <StyledWrapper>
      <P>Вітаємо у грі!</P>

      <ConfigGridButtons>
        {options.map(({ w, h }) => (
          <GridButton
            key={`${w}x${h}`}
            onClick={() => handleSelect(w, h)}
            selected={gridWidth === w && gridHeight === h}
          >
            {w}×{h}
          </GridButton>
        ))}
      </ConfigGridButtons>

      <ButtonStart onClick={() => setIsStarting(true)}>Почати</ButtonStart>
    </StyledWrapper>
  );
}
