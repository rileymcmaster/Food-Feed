import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// components
import VariationPopup from "./VariationPopup";

const TitlePage = () => {
  const currentRecipe = useSelector((state) => state.recipe);

  const [author, setAuthor] = useState("");
  const [originalRecipeVariations, setOriginalRecipeVariations] = useState([]);
  const [showVariations, setShowVariations] = useState(false);

  useEffect(() => {
    if (currentRecipe?.createdBy) {
      fetch(`https://food-feed.herokuapp.com/user/${currentRecipe.createdBy}`)
        .then((res) => res.json())
        .then((data) => {
          setAuthor(data.data);
        });
      if (currentRecipe.isOriginal) {
        setOriginalRecipeVariations([
          {
            isOriginal: true,
            variationId: currentRecipe._id,
            variationTitle: currentRecipe.recipeName,
          },
          ...currentRecipe.variations,
        ]);
      }
      if (!currentRecipe.isOriginal) {
        fetch(
          `https://food-feed.herokuapp.com/recipes/${currentRecipe.originalRecipe}`
        )
          .then((res) => res.json())
          .then((data) => {
            setOriginalRecipeVariations([
              {
                isOriginal: true,
                variationId: data.data._id,
                variationTitle: data.data.recipeName,
              },
              ...data.data.variations,
            ]);
          });
      }
    }
  }, [currentRecipe]);

  return (
    <Container>
      <Title>{currentRecipe.recipeName}</Title>
      <AuthorCard>
        {currentRecipe.isOriginal ? (
          <h2>Original recipe by:</h2>
        ) : (
          <h2>Recipe improved by:</h2>
        )}
        <UserLink to={`/user/${currentRecipe.createdBy}`}>
          <h1>@{author.handle}</h1>
        </UserLink>
      </AuthorCard>
      <VariationButton
        tabIndex="0"
        onClick={() => setShowVariations(!showVariations)}
      >
        VARIATIONS
      </VariationButton>
      <VariationPopup
        variations={originalRecipeVariations}
        showVariations={showVariations}
        handleClick={() => setShowVariations(false)}
      />
      <RecipeImage src={currentRecipe.recipeImageUrl} />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
  margin-right: 15px;
  padding: 15px;
  font-size: 1.5rem;
  text-align: center;
  max-width: 300px;
  background-color: rgba(255, 255, 255, 1);
  box-shadow: var(--recipe-box-shadow);
`;

const RecipeImage = styled.img`
  height: 100%;
  width: auto;
  position: absolute;
  z-index: -10;
`;

const AuthorCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  transform: translateY(5rem);
  text-align: center;
  h1 {
    font-size: 1.2rem;
  }
  background-color: rgba(255, 255, 255, 0.9);
`;

const UserLink = styled(Link)`
  margin: 0 auto;
  padding: 5px;
  color: var(--primary-color);
  :hover {
    box-shadow: 0 0 0 2px black, 2px 2px 3px 1px rgba(0, 0, 0, 0.5);
  }
  :active {
    color: white;
    background-color: black;
    box-shadow: 0 0 4px 2px white inset, 0 0 2px black;
  }
`;

const VariationButton = styled.button`
  border: 6px solid var(--primary-color);
  position: relative;
  z-index: 999;
  margin-top: 50px;
  font-size: 1.5rem;
  background-color: white;
  box-shadow: 0 0 0 50px rgba(0, 0, 0, 0) inset, 0 0 2px 2px rgba(0, 0, 0, 0.5);
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
  & :active {
    background-color: var(--primary-color);
    transition: none;
    box-shadow: 0 0 0 4px inset var(--primary-color), 0 0 0 8px inset white;
    opacity: 0.9;
  }
`;

export default TitlePage;
