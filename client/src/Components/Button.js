import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Button = ({ children, disabled, onClick }) => {
  return (
    <ButtonStyle onClick={onClick} className={disabled}>
      {children}
    </ButtonStyle>
  );
};
export default Button;

const ButtonStyle = styled.div`
  user-select: none;
  /* display: block; */
  outline: none;
  border: none;
  font-size: 2rem;
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 0 0 50px rgba(0, 0, 0, 0) inset, 0 0 0 2px rgba(0, 0, 0, 0.5);
  &:hover {
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
