import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Wrapper from "./Wrapper";
import { GrFormDown } from "react-icons/gr";

const RecipePage = () => {
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const titlePageRef = useRef(null);
  const ingredientsPageRef = useRef(null);

  const urlId = useParams()._id;
  console.log("recipe", currentRecipe);
  //recipe page will be one long page with ref to each different part.

  useEffect(() => {
    setLoading(true);
    fetch(`/recipes/${urlId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setCurrentRecipe(data.data);
      });
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [urlId]);

  const scrollTo = (ref) => {
    window.scroll({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };

  //EDITING
  //bug if two ingredients are the same
  const [toggleEditIngredient, setToggleEditIngredient] = useState(false);
  //UPDATE INGREDIENTS
  const updateIngredients = (e, index) => {
    const currentRecipeCopy = { ...currentRecipe };
    console.log("e", e.target.value);
    console.log("index", index);
    //update the corresponding ingredient in DIRECTIONS
    //filter through the directions array
    currentRecipeCopy.directions.filter((direction, i) => {
      //filter through the ingredients array inside the directions
      direction.ingredients.filter((ingredient, idx) => {
        //if the ingredient listed matches the one that is being edited then it will update it
        if (
          ingredient.ingredient ===
          currentRecipeCopy.ingredients[index].ingredient
        ) {
          return (direction.ingredients[idx] = {
            ingredient: e.target.value,
          });
        }
      });
    });
    currentRecipeCopy.ingredients[index] = { ingredient: e.target.value };
    setCurrentRecipe(currentRecipeCopy);
  };
  //
  const [toggleEditDirection, setToggleEditDirection] = useState(false);
  //UPDATE DIRECTIONS
  const updateDirections = (e, index) => {
    const currentRecipeCopy = { ...currentRecipe };
    // console.log("copy", currentRecipeCopy);
    currentRecipeCopy.directions[index].direction = e.target.value;
    setCurrentRecipe(currentRecipeCopy);
  };
  //
  //update ingredients from the direction page
  const updateDirectionIngredient = (e, ingredientIndex, directionIndex) => {
    const currentRecipeCopy = { ...currentRecipe };
    // console.log("e", e.target.value);
    // console.log("I index", ingredientIndex);
    // console.log("D index", directionIndex);

    //update the ingredients array
    currentRecipeCopy.ingredients.filter((ingredient, index) => {
      if (
        ingredient.ingredient ===
        currentRecipeCopy.directions[directionIndex].ingredients[
          ingredientIndex
        ].ingredient
      ) {
        return (currentRecipeCopy.ingredients[index] = {
          ingredient: e.target.value,
        });
      }
    });
    //check if any other directions reference this ingredient
    //filter through the directions array
    currentRecipeCopy.directions.map((direction, i) => {
      //filter through the ingredients array inside the directions
      direction.ingredients.filter((ingredient, idx) => {
        console.log("ingedient", ingredient.ingredient);
        console.log(
          "long path",
          currentRecipeCopy.directions[directionIndex].ingredients[
            ingredientIndex
          ].ingredient
        );
        //if the ingredient listed matches the one that is being edited then it will update it
        if (
          ingredient.ingredient ===
          currentRecipeCopy.directions[directionIndex].ingredients[
            ingredientIndex
          ].ingredient
        ) {
          direction.ingredients[idx] = { ingredient: e.target.value };
        }
      });
    });
    //change the value that is being edited
    currentRecipeCopy.directions[directionIndex].ingredients[
      ingredientIndex
    ] = { ingredient: e.target.value };
    setCurrentRecipe(currentRecipeCopy);
  };

  return currentRecipe ? (
    <>
      <Container ref={titlePageRef}>
        <Title>{currentRecipe.recipeName}</Title>
        <Icon onClick={() => scrollTo(ingredientsPageRef)}>
          <GrFormDown />
        </Icon>
      </Container>
      <Container ref={ingredientsPageRef}>
        {/* TITLE PAGE */}
        <Title>Ingredients:</Title>
        {/*  */}
        {/* INGREDIENTS PAGE */}
        {/*  */}
        <IngredientList>
          {currentRecipe.ingredients.map((ingredient, index) => {
            return (
              <>
                {!toggleEditIngredient ? (
                  <IngredientLine onClick={() => setToggleEditIngredient(true)}>
                    {ingredient.ingredient}
                  </IngredientLine>
                ) : (
                  <>
                    <IngredientLine>
                      <input
                        type="text"
                        value={ingredient.ingredient}
                        onChange={(e) => updateIngredients(e, index)}
                      ></input>
                    </IngredientLine>
                    <button onClick={() => setToggleEditIngredient(false)}>
                      CONFIRM EDIT
                    </button>
                  </>
                )}
              </>
            );
          })}
        </IngredientList>
      </Container>
      {/*  */}
      {/* DIRECTION PAGES */}
      {/*  */}
      {currentRecipe.directions.map((direction, directionIndex) => {
        return (
          <Container>
            <Title>Step: {directionIndex + 1}</Title>
            {!toggleEditDirection ? (
              <div onClick={() => setToggleEditDirection(true)}>
                {direction.direction}
              </div>
            ) : (
              <input
                type="text"
                value={direction.direction}
                onChange={(e) => updateDirections(e, directionIndex)}
              ></input>
            )}
            {/* INGREDIENTS PER PAGE */}
            <div style={{ marginTop: "50px" }}>
              <h2>Relevant ingredients:</h2>
              <IngredientList>
                {direction.ingredients.map((ingredient, ingredientIndex) => {
                  return !toggleEditIngredient ? (
                    <IngredientLine
                      onClick={() => setToggleEditIngredient(true)}
                    >
                      {ingredient.ingredient}
                    </IngredientLine>
                  ) : (
                    <>
                      <IngredientLine>
                        <input
                          type="text"
                          value={ingredient.ingredient}
                          onChange={(e) =>
                            updateDirectionIngredient(
                              e,
                              ingredientIndex,
                              directionIndex
                            )
                          }
                        ></input>
                      </IngredientLine>
                    </>
                  );
                })}
              </IngredientList>
            </div>
            {toggleEditDirection || toggleEditIngredient ? (
              <button
                onClick={() => {
                  setToggleEditIngredient(false);
                  setToggleEditDirection(false);
                }}
              >
                CONFIRM EDIT
              </button>
            ) : (
              <></>
            )}
          </Container>
        );
      })}
    </>
  ) : (
    <Wrapper>
      <h1>Loading</h1>
    </Wrapper>
  );
};
const Icon = styled.div`
  color: black;
  font-size: 30px;
  position: absolute;
  bottom: 0;
`;
const IngredientLine = styled.h1``;
const IngredientList = styled.div``;
const Title = styled.h1`
  font-size: 2rem;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  border: 2px solid blue;
`;

export default RecipePage;
