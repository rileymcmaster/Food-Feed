import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import GenerateGrid from "./GenerateGrid";
import Wrapper from "./Wrapper";

const UserPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRecipes, setCurrentUserRecipes] = useState(null);
  console.log("current user", currentUser);
  console.log("recipes", currentUserRecipes);
  const urlId = useParams()._id;

  useEffect(() => {
    //FIND USER
    fetch(`/user/${urlId}`)
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.data))
      .catch((err) => {
        console.log("error getting user", err.stack);
      });
    //FIND THEIR RECIPES
    fetch(`/recipes/user/${urlId}`)
      .then((res) => res.json())
      .then((data) => setCurrentUserRecipes(data.data))
      .catch((err) => console.log("error getting recipes", err));
  }, []);

  return (
    currentUser &&
    currentUserRecipes && (
      <Container>
        <HeadCard>
          <ProfileImageContainer>
            <ProfileImage src={currentUser.avatarUrl} />
          </ProfileImageContainer>
          <h1>{currentUser.userName}</h1>
          <h2>@{currentUser.handle}</h2>
        </HeadCard>
        <Bio>
          <p>I like spicy food and crunchy chips</p>
        </Bio>
        <GenerateGrid items={currentUserRecipes} />
      </Container>
    )
  );
};

const Bio = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
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

  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center; */
  margin: auto;
`;

export default UserPage;
