import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Wrapper from "./Wrapper";
import { GrFormDown } from "react-icons/gr";

const RecipePage = () => {
  //LOGGED IN USER
  const user = useSelector((state) => state.user);

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [firstFetch, setFirstFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const titlePageRef = useRef(null);
  const ingredientsPageRef = useRef(null);

  const urlId = useParams()._id;
  // console.log("recipe", currentRecipe);
  //recipe page will be one long page with ref to each different part.

  //FETCH RECIPE
  useEffect(() => {
    setLoading(true);
    const fetchRecipeAndAuthor = async () => {
      const recipeJson = await fetch(`/recipes/${urlId}`);
      const recipeData = await recipeJson.json();
      setCurrentRecipe(recipeData.data);
      setFirstFetch(true);
    };
    fetchRecipeAndAuthor().catch((err) => console.log("error", err));
  }, []);
  //FETCH AUTHOR
  useEffect(() => {
    if (currentRecipe) {
      fetch(`/user/${currentRecipe.createdBy}`)
        .then((res) => res.json())
        .then((data) => {
          setAuthor(data.data);
        });
      setLoading(false);
    }
  }, [firstFetch]);

  //SCROLL CONTROL
  const scrollTo = (ref) => {
    window.scroll({
      top: ref.current.offsetTop,
      behavior: "smooth",
    });
  };

  //EDITING
  const [toggleEditTitle, setToggleEditTitle] = useState(false);
  const [toggleEditIngredient, setToggleEditIngredient] = useState(false);
  const [toggleEditDirection, setToggleEditDirection] = useState(false);
  //UPDATE TITLE
  const updateTitle = (e) => {
    const currentRecipeCopy = { ...currentRecipe };
    currentRecipeCopy.recipeName = e.target.value;
    setCurrentRecipe(currentRecipeCopy);
  };
  //
  //bug if two ingredients are the same
  //UPDATE INGREDIENTS
  const updateIngredients = (e, index) => {
    const currentRecipeCopy = { ...currentRecipe };
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

  //UPDATE DIRECTIONS
  const updateDirections = (e, index) => {
    const currentRecipeCopy = { ...currentRecipe };
    currentRecipeCopy.directions[index].direction = e.target.value;
    setCurrentRecipe(currentRecipeCopy);
  };
  //
  //update ingredients from the direction page
  const updateDirectionIngredient = (e, ingredientIndex, directionIndex) => {
    const currentRecipeCopy = { ...currentRecipe };
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

  //SEND EDIT
  const [editedRecipeObject, setEditedRecipeObject] = useState(null);
  const handleSubmitChanges = () => {
    //two posts
    //1. make new recipe
    //2. update this recipe to include the new recipe in its variations array
    //3. udpate user to say they made a recipe

    const currentRecipeCopy = {
      ...currentRecipe,
      createdBy: user._id,
      isOriginal: false,
      date: "",
      originalRecipe: currentRecipe._id,
    };
    fetch(`/recipes/create/edit`, {
      method: "POST",
      body: JSON.stringify(currentRecipeCopy),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("updated recipe data");
        setEditedRecipeObject(data.data);
      });
  };
  // update the original recipe and user in the database with the new edited recipe
  useEffect(() => {
    const currentRecipeCopy = { ...currentRecipe };
    if (editedRecipeObject) {
      currentRecipeCopy.variations.push(editedRecipeObject._id);
      console.log("CURRENT", currentRecipeCopy);
      fetch(`/recipes/update/`, {
        method: "PATCH",
        body: JSON.stringify(currentRecipeCopy),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((data) => {
          console.log("added to variant array");
          setCurrentRecipe(editedRecipeObject);
        })
        .catch((err) => console.log("error", err));
    }
  }, [editedRecipeObject]);

  return currentRecipe && !loading && author ? (
    <>
      <SubmitImprovement type="button" onClick={() => handleSubmitChanges()}>
        SUBMIT
      </SubmitImprovement>
      <Container ref={titlePageRef}>
        {!toggleEditTitle ? (
          <Title onClick={() => setToggleEditTitle(true)}>
            {currentRecipe.recipeName}
          </Title>
        ) : (
          <>
            <input
              type="text"
              value={currentRecipe.recipeName}
              onChange={(e) => updateTitle(e)}
            />
            <button type="button" onClick={() => setToggleEditTitle(false)}>
              Done editing
            </button>
          </>
        )}
        <Title>{author.handle}</Title>
        {/* next page button */}
        <Icon onClick={() => scrollTo(ingredientsPageRef)}>
          <GrFormDown />
        </Icon>
        <RecipeImage src={currentRecipe.recipeImageUrl} />
      </Container>
      {/* TITLE PAGE */}
      <Container ref={ingredientsPageRef}>
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
const SubmitImprovement = styled.button`
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 20px;
  padding: 20px;
  background-color: red;
  font-weight: bold;
`;

const RecipeImage = styled.img`
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -1;
`;
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
  &:first-child {
    background-color: rgba(255, 255, 255, 0.5);
    padding: 20px;
  }
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
