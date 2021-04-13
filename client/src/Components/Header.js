import React from "react";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <NavContainer>
      <Link to={"/"}>Home // </Link>
      <Link to={"/recipes"}> Recipes //</Link>
      <Link to={"/signin"}> Sign in //</Link>
      <Link to={"/signup"}> Sign up //</Link>
      <Link to={"/recipe/create"}> Create Recipe</Link>
    </NavContainer>
  );
};
const NavContainer = styled.div`
  position: fixed;
  /* height: 200px; */
  width: 100%;
`;

export default Header;
