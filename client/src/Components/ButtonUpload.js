import React from "react";
import Loading from "./Loading";
import styled, { keyframes } from "styled-components";
import { VscLoading } from "react-icons/vsc";

const ButtonUpload = ({ children, disabled, onClick, wait, fail, success }) => {
  console.log("wait", wait);
  console.log("success", success);
  return wait ? (
    <ButtonStyle onClick={onClick} className={disabled}>
      <Icon>
        <VscLoading size={30} />
      </Icon>
    </ButtonStyle>
  ) : success ? (
    <ButtonStyle onClick={onClick} className="complete">
      {success}
    </ButtonStyle>
  ) : fail ? (
    <ButtonStyle onClick={onClick} className={disabled}>
      {fail}
    </ButtonStyle>
  ) : (
    <ButtonStyle onClick={onClick} className={disabled}>
      {children}
    </ButtonStyle>
  );
};
export default ButtonUpload;

const ButtonStyle = styled.div`
  user-select: none;
  max-height: 50px;
  overflow-y: hidden;
  /* display: block; */
  outline: none;
  border: none;
  font-weight: bold;
  /* font-size: 1rem; */
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 0 0 50px rgba(0, 0, 0, 0) inset, 0 0 0 2px rgba(0, 0, 0, 0.5);
  &:hover,
  &.complete {
    transition: 0.5s ease-in-out;
    box-shadow: 0 0 0 50px var(--primary-color) inset;
    color: white;
  }
  &:focus {
    box-shadow: 0 0 0 50px var(--primary-color) inset;
    color: white;
    transition: 0.5s ease-in-out;
  }
  :active {
    background-color: var(--primary-color);
    /* color: var(--primary-color); */
    transition: none;
    /* box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5) inset; */
    box-shadow: 0 0 0 4px inset var(--primary-color), 0 0 0 8px inset white;
    opacity: 0.9;
  }
  &.disabled {
    pointer-events: none;
    user-select: none;
    opacity: 0.5;
    /* box-shadow: 0 0 0 50px/ rgba(0, 0, 0, 0) inset, 0 0 0 2px rgba(0, 0, 0, 0.5); */
    /* color: rgba(0,0,0,); */
  }
`;

const rotate = keyframes`
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}
`;

const Icon = styled.div`
  padding: 0;
  height: 100%;
  animation: ${rotate} 1s ease-in-out infinite;
`;
