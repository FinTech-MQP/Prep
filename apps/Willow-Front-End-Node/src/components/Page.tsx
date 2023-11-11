import { ReactNode } from "react";
import styled from "@emotion/styled";
import { WILLOW_COLOR } from "@monorepo/utils";

interface PageProps {
  children: ReactNode;
  isOpen: boolean;
  left: boolean;
}

const StyledPage = styled.div<PageProps>`
  background-color: white;
  position: absolute;
  width: 100%;
  height: calc(100% - 20px);
  left: ${({ isOpen, left }) => (isOpen ? "0" : left ? "-120%" : "120%")};
  top: 0;
  overflow-y: auto;
  transition: left 0.5s;
  padding: 10px 10px 10px 0;
  margin: 10px 0 10px 0;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: ${WILLOW_COLOR};

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${WILLOW_COLOR};
    border-radius: 20px;
    border: none;
  }
`;

export const Page = ({ children, isOpen, left }: PageProps) => {
  return (
    <StyledPage isOpen={isOpen} left={left}>
      {children}
    </StyledPage>
  );
};
