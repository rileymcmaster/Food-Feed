import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "./actions";
import { GiBurn } from "react-icons/gi";

const Header = () => {
  //USER STATE
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [toggleMenu, setToggleMenu] = useState(false);

  //SIGN OUT
  const handleSignout = () => {
    fetch("https://food-feed.herokuapp.com/user/signout", {
      method: "PATCH",
      body: JSON.stringify({ user }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        window.localStorage.removeItem("_id");
        dispatch(signOut());
      })
      .catch((err) => {
        console.log("error signing out", err);
      });
  };
  return (
    <Container>
      {user.isSignedIn ? (
        <>
          <UserMenu onMouseLeave={() => setToggleMenu(false)}>
            {/* <Link to={"/recipes"}> */}
            <ImageContainer
              onClick={() => setToggleMenu(!toggleMenu)}
              onMouseEnter={() => setToggleMenu(true)}
            >
              <img src={user.avatarUrl} />
            </ImageContainer>
            {/* </Link> */}
            {/* DROP DOWN */}
            {toggleMenu && (
              <>
                <UserDropdown toggleMenu={toggleMenu}>
                  {/* FEED */}
                  <MenuLink
                    to={"/recipes"}
                    onClick={() => setToggleMenu(false)}
                  >
                    The FEED
                  </MenuLink>
                  {/* CREATE */}
                  <MenuLink
                    to={"/recipe/create"}
                    onClick={() => {
                      setToggleMenu(false);
                    }}
                  >
                    Create recipe
                  </MenuLink>
                  {/* PROFILE */}
                  <MenuLink
                    to={`/user/${user._id}`}
                    onClick={() => setToggleMenu(false)}
                  >
                    Profile
                  </MenuLink>
                  {/* LOGOUT */}
                  <MenuLink
                    to={"/recipes"}
                    onClick={() => {
                      handleSignout();
                      setToggleMenu(false);
                    }}
                  >
                    Log out
                  </MenuLink>
                </UserDropdown>
              </>
            )}
          </UserMenu>
          {/* </div> */}
          {/* END DROPDOWN */}
        </>
      ) : (
        // NO USER SIGNED IN
        <>
          <UserMenu
            onMouseLeave={() => setToggleMenu(false)}
            onFocus={() => setToggleMenu(true)}
          >
            <IconContainer
              tabIndex="1"
              onClick={() => setToggleMenu(!toggleMenu)}
              onMouseEnter={() => setToggleMenu(true)}
            >
              <GiBurn size={40} />
            </IconContainer>

            {toggleMenu && (
              <UserDropdown toggleMenu={toggleMenu}>
                <MenuLink to={"/recipes"} onClick={() => setToggleMenu(false)}>
                  The FEED
                </MenuLink>
                <MenuLink to={"/signin"} onClick={() => setToggleMenu(false)}>
                  Sign in
                </MenuLink>
                <MenuLink to={"/signup"} onClick={() => setToggleMenu(false)}>
                  Sign up
                </MenuLink>
              </UserDropdown>
            )}
          </UserMenu>
        </>
      )}
    </Container>
  );
};

// main div
const Container = styled.div`
  position: fixed;
  display: flex;
  /* right: 0; */
  flex-direction: row;
  padding: 20px;
  z-index: 9;
`;
// contains the icon and the menu
const UserMenu = styled.div`
  position: relative;
  display: inline-block;
  width: auto;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.05);
  outline: 1px solid transparent;
`;
// profile pic icon
const ImageContainer = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 0 5px black;
  background-color: black;
  overflow: hidden;
  z-index: 999999;
  img {
    width: 100%;
    height: auto;
  }
`;
// DROP DOWN
// animate dropdown
const growDown = keyframes`
0% {
  transform: scaleY(0);
  opacity: 0%;
}
80% {
  /* causes ghost pixels */
  /* transform: scaleY(1.1); */
  opacity: 100%;
}
100%{
  transform: scaleY(1)
}
`;
const UserDropdown = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  background-color: white;
  animation: ${growDown} 300ms ease-in-out forwards;
  transform-origin: top center;
  width: 250px;
  padding: 10px;
  box-shadow: var(--recipe-box-shadow);
`;

const MenuLink = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: black;
  height: 50px;
  padding: 15px 5px;
  font-weight: bold;
  :hover {
    background-color: black;
    color: white;
  }
`;

const IconContainer = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 50%;
  box-shadow: 0 0 0 5px black;
  background-color: black;
  padding-bottom: 3px;
  overflow: hidden;
  /* z-index: 999999; */
`;

export default Header;
