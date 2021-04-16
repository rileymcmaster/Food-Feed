import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { signOut } from "./actions";
import GenerateGrid from "./GenerateGrid";

const UserPage = () => {
  //LOGGED IN USER
  const user = useSelector((state) => state.user);
  // local states
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [currentUserRecipes, setCurrentUserRecipes] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [deleteUserWarning, setDeleteUserWarning] = useState(false);
  // utils
  const urlId = useParams()._id;
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    //FIND USER
    fetch(`/user/${urlId}`)
      .then((res) => res.json())
      .then((data) => setCurrentUserProfile(data.data))
      .catch((err) => {
        console.log("error getting user", err.stack);
      });
    //FIND THEIR RECIPES
    fetch(`/recipes/user/${urlId}`)
      .then((res) => res.json())
      .then((data) => setCurrentUserRecipes(data.data))
      .catch((err) => console.log("error getting recipes", err));
  }, [urlId]);

  //is it the logged in user's profile T/F
  useEffect(() => {
    if (currentUserProfile && user && user._id === currentUserProfile._id) {
      setLoggedInUser(true);
    }
  }, [currentUserProfile, urlId]);

  //DELETE ACCOUNT
  const handleDeleteAccount = () => {
    //update state like a log out
    //change is deleted to true on account

    if (loggedInUser) {
      //set deactive: true in user db
      fetch(`/user/delete`, {
        method: "PATCH",
        body: JSON.stringify({ user }),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log("user delete", data))
        .catch((err) => console.log("problem deleting user", err));
      //
      // delete the user's recipes
      fetch(`/recipes/user/delete/${user._id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log("deleted user's recipes", data))
        .catch((err) => console.log("probleming deleting user's recipes", err));
      //
      //update state to no user
      dispatch(signOut());
      history.push("/recipes");
    }
  };

  return (
    currentUserProfile &&
    currentUserRecipes && (
      <Container>
        <HeadCard>
          <ProfileImageContainer>
            <ProfileImage src={currentUserProfile.avatarUrl} />
          </ProfileImageContainer>
          <h1>{currentUserProfile.userName}</h1>
          <h2>@{currentUserProfile.handle}</h2>
          {loggedInUser && (
            <>
              <h2>This is you</h2>{" "}
              <button
                type="button"
                onClick={() => setDeleteUserWarning(!deleteUserWarning)}
              >
                Delete account
              </button>
              {deleteUserWarning ? (
                <DeleteAccountPopup>
                  <h1>All of your recipes will be deleted</h1>
                  <DeleteAccountButton
                    type="button"
                    onClick={() => handleDeleteAccount()}
                  >
                    I don't care. Delete this account
                  </DeleteAccountButton>
                  <button
                    type="button"
                    onClick={() => setDeleteUserWarning(!deleteUserWarning)}
                  >
                    Don't delete me
                  </button>
                </DeleteAccountPopup>
              ) : (
                <></>
              )}
            </>
          )}
        </HeadCard>
        <Bio>
          <p>I like spicy food and crunchy chips</p>
        </Bio>
        <GenerateGrid items={currentUserRecipes.reverse()} />
      </Container>
    )
  );
};
const DeleteAccountButton = styled.button`
  z-index: 99999999999999;
  padding: 5px;
  font-size: 1rem;
  width: 150px;
`;
const DeleteAccountPopup = styled.div`
  /* width: 100vw; */
  /* height: 100vh; */
  /* overflow: hidden; */
  padding: 1rem;
  background-color: rgba(0, 0, 0, 1);
  position: absolute;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  h1 {
    color: white;
    z-index: 9999999;
  }
  box-shadow: 0 0 0 100vh rgba(0, 0, 0, 0.8);

  /* margin: auto; */
  z-index: 999999;
  font-size: 3rem;
`;

const Bio = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: auto;
  display: block;
  margin-bottom: 0 auto;
  position: absolute;
`;
const ProfileImageContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background-color: black;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 10px 7px 2px black;
`;
const HeadCard = styled.div`
  padding: 2rem 1rem;

  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & h1 {
    margin-top: 1rem;
    font-size: 2rem;
  }

  & h2 {
    margin-top: 0.5rem;
    font-size: 1.5rem;
    color: grey;
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  margin: auto;
  position: relative;
`;

export default UserPage;
