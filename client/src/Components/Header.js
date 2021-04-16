import React, { useState } from "react";
import styled from "styled-components";
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
    fetch("/user/signout", {
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
        console.log("data", data);
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
                <UserDropdown>
                  {/* FEED */}
                  <MenuLink
                    to={"/recipes"}
                    onClick={() => setToggleMenu(false)}
                  >
                    The FEED
                  </MenuLink>
                  {/* CREATE */}
                  <MenuLink
                    to={"/recipes/create"}
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
          <UserMenu onMouseLeave={() => setToggleMenu(false)}>
            <IconContainer
              onClick={() => setToggleMenu(!toggleMenu)}
              onMouseEnter={() => setToggleMenu(true)}
            >
              <GiBurn size={40} />
            </IconContainer>

            {toggleMenu && (
              <UserDropdown>
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
  flex-direction: row;
  padding: 20px;
  width: 100vw;
  z-index: 9;
`;
// contains the icon and the menu
const UserMenu = styled.div`
  position: relative;
  display: inline-block;
  width: auto;
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
  z-index: 99;
  img {
    width: 100%;
    height: auto;
  }
`;
// DROP DOWN
const UserDropdown = styled.div`
  position: absolute;
  /* z-index: 999999999; */
  /* height: 1000px; */
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  background-color: white;
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
  /* vertical-align: center; */
  :hover {
    background-color: black;
    color: white;
  }
`;

const CreateLink = styled(Link)`
  position: relative;
  text-decoration: none;
  color: black;
  margin-left: auto;
  /* margin-right: 5px; */

  h1 {
    margin-top: 10px;
  }
  :hover {
    filter: invert(100%);
    /* background-color: blue; */
    color: teal;
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
