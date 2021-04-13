import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import AvatarImage from "./AvatarImage";

const Header = () => {
  //USER STATE
  const user = useSelector((state) => state.user);
  // console.log("user", Boolean(user));
  return (
    <NavContainer>
      <Link to={"/"}>Home // </Link>
      <Link to={"/recipes"}> Recipes //</Link>
      <Link to={"/signin"}> Sign in //</Link>
      <Link to={"/signup"}> Sign up //</Link>
      <Link to={"/recipe/create"}> Create Recipe</Link>
      {user.isSignedIn ? (
        <div>
          <h1>Logged in: @{user.handle}</h1>
          <AvatarImage img={user.avatarUrl} />
        </div>
      ) : (
        <h1> Please sign in </h1>
      )}
    </NavContainer>
  );
};
const NavContainer = styled.div`
  position: fixed;
  display: flex;
  flex-direction: row;
  /* height: 200px; */
  width: 100%;

  h1 {
    margin-left: auto;
  }
  div {
    display: flex;
    flex-direction: row;
  }
`;

export default Header;
