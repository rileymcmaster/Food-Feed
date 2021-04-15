import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Wrapper from "./Wrapper";
import { GrFormDown } from "react-icons/gr";
import AddSubstractButton from "./AddSubtractButton";

const RecipePage = () => {
  //LOGGED IN USER
  const user = useSelector((state) => state.user);

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [firstFetch, setFirstFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const [showVariations, setShowVariations] = useState(false);
  const widthIngredients = useRef(0);

  const urlId = useParams()._id;
  // console.log("recipe", currentRecipe);

  //FETCH RECIPE
  useEffect(() => {
    setFirstFetch(false);
    setLoading(true);
    const fetchRecipeAndAuthor = async () => {
      const recipeJson = await fetch(`/recipes/${urlId}`);
      const recipeData = await recipeJson.json();
      setCurrentRecipe(recipeData.data);
      setFirstFetch(true);
    };
    fetchRecipeAndAuthor().catch((err) => console.log("error", err));
  }, [urlId]);
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

  //EDITING
  const [toggleEdit, setToggleEdit] = useState(false);
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
    currentRecipeCopy.directions.filter((direction, i) => {
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

  //SEND EDIT TO SERVER
  const [editedRecipeObject, setEditedRecipeObject] = useState(null);
  const handleSubmitChanges = () => {
    const currentRecipeCopy = {
      ...currentRecipe,
      createdBy: user._id,
      isOriginal: false,
      date: "",
      originalRecipe: "",
    };
    //keep the link to original recipe
    if (currentRecipe.isOriginal) {
      currentRecipeCopy.originalRecipe = currentRecipe._id;
    } else {
      currentRecipeCopy.originalRecipe = currentRecipe.originalRecipe;
    }
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
        setAuthor(user);
      });
  };
  // update the original recipe and user in the database with the new edited recipe
  useEffect(() => {
    const currentRecipeCopy = { ...currentRecipe };
    if (editedRecipeObject) {
      currentRecipeCopy.variations.push({
        variationId: editedRecipeObject._id,
        variationTitle: editedRecipeObject.recipeName,
      });
      //UPDATE ORIGINAL RECIPE *Variations* array
      fetch(`/recipes/update/`, {
        method: "PATCH",
        body: JSON.stringify(currentRecipeCopy),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("added to variant array");
          setCurrentRecipe(editedRecipeObject);
        })
        .catch((err) => console.log("error", err));
      // UPDATE USER'S RECIPES ARRAY
      fetch(`/user/edit/recipe`, {
        method: "PATCH",
        body: JSON.stringify(editedRecipeObject),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log("updated user array", data))
        .catch((err) => console.log("User's recipe array not updated", err));
    }
  }, [editedRecipeObject]);

  return currentRecipe && !loading && author ? (
    <PageWrapper>
      {/* EDIT BUTTONS */}
      <EditButtonsContainer>
        <EditRecipeBtn type="button" onClick={() => setToggleEdit(!toggleEdit)}>
          {toggleEdit ? "Done" : "Edit"}
        </EditRecipeBtn>
        <SubmitImprovementBtn
          type="button"
          onClick={() => handleSubmitChanges()}
        >
          SUBMIT
        </SubmitImprovementBtn>
      </EditButtonsContainer>
      {/* TITLEPAGE */}
      <Container>
        {/* TITLE */}
        <TitlePage>
          <Title>
            <input
              size={
                currentRecipe.recipeName.length
                  ? currentRecipe.recipeName.length
                  : "1"
              }
              maxLength="20"
              class="title"
              type="text"
              pattern="[A-Za-z0-9 ]+"
              required
              value={currentRecipe.recipeName}
              onChange={(e) => updateTitle(e)}
              disabled={!toggleEdit}
            />
          </Title>
          {currentRecipe.isOriginal ? (
            <>
              <AuthorCard>
                <h1>Original recipe by:</h1>
                {/* LINK */}
                <h1>@{author.handle}</h1>
              </AuthorCard>
              <VariationButton
                onClick={() => setShowVariations(!showVariations)}
              >
                VARIATIONS
              </VariationButton>
              {showVariations && (
                <VariationCard>
                  {currentRecipe.variations.map((variation) => {
                    return (
                      <VariationLink to={`/recipe/${variation.variationId}`}>
                        {variation.variationTitle}
                      </VariationLink>
                    );
                  })}
                </VariationCard>
              )}
            </>
          ) : (
            <>
              <AuthorCard>
                <h1>Recipe improved by:</h1>
                {/* LINK */}
                <h1>@{author.handle}</h1>
              </AuthorCard>
              <VariationButton
                onClick={() => setShowVariations(!showVariations)}
              >
                VARIATIONS
              </VariationButton>
              {/* TODO GET Variations from the original */}
              {/* {showVariations && (
                <VariationCard>
                  {currentRecipe.variations.map((variation) => {
                    return (
                      <VariationLink to={`/recipe/${variation.variationId}`}>
                        {variation.variationTitle}
                      </VariationLink>
                    );
                  })} */}
              {/* </VariationCard> */}
              {/* )} */}
            </>
          )}
        </TitlePage>
        {/* IMAGE */}
        <RecipeImage src={currentRecipe.recipeImageUrl} />
      </Container>
      {/* END TITLE PAGE */}
      {/*  */}
      {/* INGREDIENTS PAGE */}
      <Container>
        <IngredientsPage>
          <SubHeader>Ingredients:</SubHeader>
          <IngredientList ref={widthIngredients}>
            {currentRecipe.ingredients.map((ingredient, index) => {
              return (
                <IngredientLine>
                  <input
                    size={widthIngredients.current.offsetWidth / 15}
                    disabled={!toggleEdit}
                    type="text"
                    value={ingredient.ingredient}
                    onChange={(e) => updateIngredients(e, index)}
                  ></input>
                </IngredientLine>
              );
            })}
          </IngredientList>
          {toggleEdit && (
            <AddSubstractButton
              state={currentRecipe}
              setState={setCurrentRecipe}
              modifier={"newIngredient"}
            />
          )}
        </IngredientsPage>
      </Container>
      {/*  */}
      {/* DIRECTION PAGES */}
      {/*  */}
      {currentRecipe.directions.map((direction, directionIndex) => {
        return (
          <Container>
            <DirectionsPage>
              {/* ingredients */}
              <IngredientCard>
                {direction.ingredients.map((ingredient, ingredientIndex) => {
                  return (
                    <>
                      <IngredientLine>
                        <input
                          disabled={!toggleEdit}
                          type="text"
                          size={ingredient.ingredient.length}
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
              </IngredientCard>
              <SubHeader style={{ marginTop: "-20%" }}>
                Step: {directionIndex + 1}
              </SubHeader>
              <DirectionCard>
                <textarea
                  rows="4"
                  cols="50"
                  disabled={!toggleEdit}
                  // type="text"
                  value={direction.direction}
                  onChange={(e) => updateDirections(e, directionIndex)}
                ></textarea>
              </DirectionCard>
            </DirectionsPage>
          </Container>
        );
      })}
    </PageWrapper>
  ) : (
    <Wrapper>
      <h1>Loading</h1>
    </Wrapper>
  );
};
const VariationLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 2rem;
  text-align: center;
  justify-content: center;
  margin-top: 20px;
  &:hover {
    text-shadow: 0 0 5px white;
  }
`;
const VariationCard = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  justify-content: flex-start;
  background-color: rgba(0, 0, 0, 0.5);
  width: 80%;
  height: 80%;
  margin: auto;
`;
const VariationButton = styled.button`
  z-index: 999;
  margin-top: 50px;
  font-size: 2rem;
  background-color: rgba(255, 255, 255, 0.5);
  text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.8),
    2px 2px 5px rgba(255, 255, 255, 0.5);
`;
const AuthorCard = styled.div`
  padding: 20px;
  /* margin-top: 50%; */
  text-align: center;

  h1 {
    font-size: 3rem;
  }
  background-color: rgba(255, 255, 255, 0.5);
  text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.8),
    2px 2px 5px rgba(255, 255, 255, 0.5);
`;

const EditButtonsContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 20px;
  z-index: 9999;
  /* padding: 20px; */
`;
const EditRecipeBtn = styled.button`
  position: relative;
  padding: 20px;
  background-color: red;
  font-weight: bold;
  width: 100px;
`;
const SubmitImprovementBtn = styled.button`
  position: relative;
  padding: 20px;
  background-color: red;
  font-weight: bold;
  width: 100px;
`;

const RecipeImage = styled.img`
  height: 100%;
  width: auto;
  position: absolute;
  z-index: -10;
`;
const Icon = styled.div`
  color: black;
  font-size: 30px;
  position: absolute;
  bottom: 0;
`;

const DirectionCard = styled.div`
  position: relative;
  font-size: 2rem;
  margin-top: 2rem;
  box-shadow: 5px 5px 0 5px black, 0 0 5px rgba(0, 0, 0, 0.5);

  textarea {
    padding: 20px;
    font-size: 2rem;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    resize: none;
  }
  textarea:focus {
    box-shadow: 0 0 10px blue;
  }
`;
const IngredientCard = styled.div`
  height: 300px;
  position: relative;
`;

const DirectionsPage = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 100%; */
`;

const IngredientLine = styled.div`
  /* margin-bottom: 20px; */
  padding: 20px;
  & input {
    background-color: transparent;
    font-size: 1.5rem;
    text-align: left;
    size: 100%;
    outline: none;
    border: none;
    box-shadow: none;
    color: black;
  }
  & input:disabled {
    color: black;
  }
  & input:focus-within {
    /* border: none; */
    border-bottom: 2px solid blue;
    outline: none;
    box-shadow: 0 1px 2px blue;
  }
  & input:focus {
    border-bottom: 2px solid blue;
    /* border: none; */
    outline: none;
  }
`;
const IngredientList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-shadow: 5px 5px 0 5px black, 0 0 5px rgba(0, 0, 0, 0.5);
`;

const IngredientsPage = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SubHeader = styled.div`
  font-size: 3rem;
`;

const Title = styled.div`
  margin: auto 0;
  overflow: hidden;
  /* display: flex; */
  justify-content: center;
`;
const TitlePage = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10%;

  & input.title {
    border: none;
    box-shadow: none;
    outline: none;
    text-align-last: center;
  }

  & input:disabled.title {
    /* background-color: white; */
    color: black;
  }
  input:focus-within.title {
    /* border: none; */
    border: 5px solid blue;
    /* box-shadow: 0 0 10px 10px blue; */
  }
  input:focus.title {
    outline: 20px solid blue;
    box-shadow: 0 0 10px blue;
  }

  input:invalid.title {
    /* background-color: red; */
    outline: 2px solid red;
    box-shadow: 0 0 5px red;
  }

  input.title {
    caret-color: blue;
    font-size: 4rem;
    padding: 0;

    /* padding: 50px 0px; */
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.5);
    text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.8),
      2px 2px 5px rgba(255, 255, 255, 0.5);
  }
`;
const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  scroll-snap-align: center;
  scroll-snap-stop: normal;
  overflow: hidden;
  z-index: 0;
  background: rgb(238, 238, 238);
  background: linear-gradient(
    0deg,
    rgba(238, 238, 238, 1) 0%,
    rgba(241, 241, 241, 0) 13%,
    rgba(255, 255, 255, 0) 84%,
    rgba(238, 238, 238, 1) 100%
  );
`;

const PageWrapper = styled.div`
  /* overflow: hidden; */
  padding: 0;
  margin: 0;
  height: 100%;
  scroll-snap-type: proximity;
  -webkit-scroll-snap-type: proximity;
  -webkit-scroll-snap-destination: 0% 0%;
  -webkit-overflow-scrolling: touch;
`;

export default RecipePage;
