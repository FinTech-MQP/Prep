import styled from "@emotion/styled";
import { WILLOW_COLOR, WILLOW_COLOR_HOVER } from "@monorepo/utils";

interface BookmarkButtonProps {
  onClick: () => void;
  label: string;
  clicked: boolean;
}

export const BookmarkButton = ({
  onClick,
  label,
  clicked,
}: BookmarkButtonProps) => {
  const StyledButton = styled.button`
    background-color: ${clicked ? WILLOW_COLOR_HOVER : WILLOW_COLOR};
    color: white;
    border-radies: 0;
    border: none;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    position: relative;
    cursor: pointer;
    font-size: 18px;
    padding: 8px 16px 8px 16px;
    margin: 10px 0 0 0;

    &:hover {
      background-color: ${WILLOW_COLOR_HOVER};
    }
  `;

  return <StyledButton onClick={onClick}>{label}</StyledButton>;
};
