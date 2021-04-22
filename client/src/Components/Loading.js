import React from "react";
import styled, { keyframes } from "styled-components";
import { VscLoading } from "react-icons/vsc";

const Loading = () => {
  return (
    <IconContainer>
      <Icon>
        <VscLoading size={60} />
      </Icon>
    </IconContainer>
  );
};
const IconContainer = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin: auto;
`;
//
const rotate = keyframes`
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${rotate} 1s ease-in-out infinite;
`;

export default Loading;
