import { ReactNode } from "react";
import styled from "@emotion/styled";
import { WILLOW_COLOR } from "@monorepo/utils";

interface PageProps {
  children: ReactNode;
  isOpen: boolean;
}

const StyledPage = styled.div<PageProps>`
  position: absolute;
  width: 100%;
  height: calc(100% - 20px);
  left: ${({ isOpen }) => (isOpen ? "0" : "-120%")};
  top: 0;
  overflow-y: auto;
  transition: left 0.5s;
  padding: 10px;
  margin: 10px 0 10px;
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

export const Page = ({ children, isOpen }: PageProps) => {
  return <StyledPage isOpen={isOpen}>{children}</StyledPage>;
};
