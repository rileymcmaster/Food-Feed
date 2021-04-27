import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GridDisplay from "./Feed/GridDisplay";
import { signOut } from "./actions";
import { BsGearWideConnected } from "react-icons/bs";

const UserPage = () => {
  //LOGGED IN USER
  const user = useSelector((state) => state.user);
  // local states
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [currentUserRecipes, setCurrentUserRecipes] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [deleteUserWarning, setDeleteUserWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);

  const urlId = useParams()._id;
  const dispatch = useDispatch();
  const history = useHistory();

  //FIND USER
  useEffect(() => {
    setLoading(true);
    // the fetch relies checks if it is the signed in user's account
    // the delay prevents the page from loading twice
    const delayFetch = setTimeout(() => {
      fetch(`/user/${urlId}`)
        .then((res) => res.json())
        .then(({ status, data, message }) => {
          if (status === 200) {
            setCurrentUserProfile(data);
          } else {
            console.log("status ", status);
            console.log("error messsage: ", message);
            history.push("/error");
          }
        })
        .catch((err) => {
          console.log("error getting user", err.stack);
        });
    }, 500);
    return () => clearTimeout(delayFetch);
  }, [urlId]);

  // FIND THE USER's RECIPES
  useEffect(() => {
    fetch(`/recipes/user/${urlId}`)
      .then((res) => res.json())
      .then((data) => {
        // if you are viewing your own profile, you can see private recipes
        if (user._id === urlId && user.isSignedIn) {
          setCurrentUserRecipes(data.data);
        } else {
          // otherwise, filter private recipes
          const filterPrivate = data.data.filter((recipe) => {
            return !recipe.isPrivate;
          });
          setCurrentUserRecipes(filterPrivate);
        }
      })
      .catch((err) => console.log("error getting recipes", err));
    setLoading(false);
  }, [currentUserProfile]);

  //logged in user's profile?
  useEffect(() => {
    if (currentUserProfile && user && user._id === currentUserProfile._id) {
      setLoggedInUser(true);
    }
  }, [currentUserProfile, urlId]);

  //DELETE ACCOUNT
  const handleDeleteAccount = () => {
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
              {/* OPTIONS */}
              <OptionIcon onClick={() => setToggleMenu(!toggleMenu)}>
                <BsGearWideConnected size={40} />
              </OptionIcon>
              {/* DELETE ACCOUNT */}
              {toggleMenu && (
                <button
                  type="button"
                  onClick={() => setDeleteUserWarning(!deleteUserWarning)}
                >
                  Delete account
                </button>
              )}
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
          <p>{currentUserProfile.bio}</p>
        </Bio>
        <GridDisplay items={currentUserRecipes} />
      </Container>
    )
  );
};
// Contains the whole page
const Container = styled.div`
  padding: 20px 40px;
  overflow-x: hidden;
  margin: auto;
  position: relative;
`;

const OptionIcon = styled.div`
  margin-top: 10px;
`;

const DeleteAccountButton = styled.button`
  z-index: 99999999999999;
  padding: 5px;
  font-size: 1rem;
  width: 150px;
`;
const DeleteAccountPopup = styled.div`
  padding: 1rem;
  background-color: rgba(0, 0, 0, 1);
  position: absolute;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 0 0 100vh rgba(0, 0, 0, 0.8);
  z-index: 999999;
  font-size: 3rem;
  h1 {
    color: white;
    z-index: 9999999;
  }
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
  box-shadow: 12px 8px 2px 2px black, 0 0 4px rgba(0, 0, 0, 0.2);
`;
const HeadCard = styled.div`
  padding: 2rem 1rem;
  width: 100%;
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

export default UserPage;
