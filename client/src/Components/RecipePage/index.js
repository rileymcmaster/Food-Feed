import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Wrapper from "../Wrapper";
import AddSubstractButton from "../Buttons/AddSubtractButton";
import { TiPencil } from "react-icons/ti";
import { ImCheckmark2 } from "react-icons/im";
import AddStep from "../Buttons/AddStep";
import Loading from "../Loading";
import IngredientsPopOut from "./IngredientsPopOut";

const RecipePage = () => {
  //LOGGED IN USER
  const user = useSelector((state) => state.user);

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [firstFetch, setFirstFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const [originalVariations, setOriginalVariations] = useState(null);
  const [showVariations, setShowVariations] = useState(false);
  const widthIngredients = useRef(0);
  //get the params to fetch the recipe
  const urlId = useParams()._id;
  const history = useHistory();

  //FETCH RECIPE
  useEffect(() => {
    setFirstFetch(false);
    setLoading(true);
    fetch(`/recipes/${urlId}`)
      .then((res) => res.json())
      .then(({ status, data, message }) => {
        if (status === 200) {
          setCurrentRecipe(data);
        } else {
          console.log("status", status);
          console.log("error message: ", message);
          history.push("/error");
        }
      })
      .then(() => setFirstFetch(true))
      .catch((err) => console.log("error getting recipe", err));
  }, [urlId]);
  //FETCH AUTHOR
  useEffect(() => {
    if (currentRecipe) {
      fetch(`/user/${currentRecipe.createdBy}`)
        .then((res) => res.json())
        .then((data) => {
          setAuthor(data.data);
        });
      if (!currentRecipe.isOriginal) {
        fetch(`/recipes/${currentRecipe.originalRecipe}`)
          .then((res) => res.json())
          .then((data) =>
            setOriginalVariations([
              {
                isOriginal: true,
                variationId: data.data._id,
                variationTitle: data.data.recipeName,
              },
              ...data.data.variations,
            ])
          );
      }
      setLoading(false);
    }
  }, [firstFetch]);

  //EDITING
  const [toggleEdit, setToggleEdit] = useState(false);
  // toggle show/hide checkboxes of ingredients on direction page
  const [toggleIngredientCheckboxes, setToggleIngredientCheckboxes] = useState(
    false
  );
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
    let filterDirections = currentRecipeCopy.directions.filter(
      (direction, i) => {
        let filterIngredients = direction.ingredients.filter(
          (ingredient, idx) => {
            //if the ingredient listed matches the one that is being edited then it will update it
            if (
              ingredient.ingredient ===
              currentRecipeCopy.ingredients[index].ingredient
            ) {
              return (direction.ingredients[idx] = {
                ingredient: e.target.value,
              });
            }
          }
        );
      }
    );
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
      currentRecipeCopy.variations.unshift({
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

  // HANDLE CHECKBOXES of ingredients on direction page
  const updateDirectionsIngredientsLink = (e, directionIndex) => {
    let currentRecipeCopy = { ...currentRecipe };
    const index = currentRecipeCopy.directions[
      directionIndex
    ].ingredients.findIndex(
      (ingredient) => ingredient.ingredient === e.target.value
    );
    if (index >= 0) {
      currentRecipeCopy.directions[directionIndex].ingredients.splice(index, 1);
    } else {
      currentRecipeCopy.directions[directionIndex].ingredients = [
        ...currentRecipeCopy.directions[directionIndex].ingredients,
        { ingredient: e.target.value },
      ];
    }
    setCurrentRecipe(currentRecipeCopy);
  };

  const REupdateDirectionIngredient = (e, directionIndex) => {
    let currentRecipeCopy = { ...currentRecipe };
    console.log("E", e.target.value);
  };

  return currentRecipe && !loading && author ? (
    <PageWrapper>
      {/* TITLEPAGE */}
      <Container>
        {/* TITLE */}
        <TitlePage>
          <Title tabIndex="0">
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
                <UserLink to={`/user/${author._id}`}>
                  <h1>@{author.handle}</h1>
                </UserLink>
              </AuthorCard>
              <VariationButton
                tabIndex="0"
                onClick={() => setShowVariations(!showVariations)}
              >
                VARIATIONS
              </VariationButton>
              {showVariations && (
                <VariationCard>
                  {currentRecipe.variations.map((variation) => {
                    return (
                      <VariationLink
                        to={`/recipe/${variation.variationId}`}
                        onClick={() => setShowVariations(false)}
                      >
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
                <UserLink to={`/user/${author._id}`}>
                  <h1>@{author.handle}</h1>
                </UserLink>
              </AuthorCard>
              <VariationButton
                onClick={() => setShowVariations(!showVariations)}
              >
                VARIATIONS
              </VariationButton>
              {showVariations && (
                <VariationCard>
                  {originalVariations.map((variation) => {
                    return (
                      <VariationLink
                        to={`/recipe/${variation.variationId}`}
                        onClick={() => setShowVariations(false)}
                      >
                        {variation.variationTitle}
                        {variation.isOriginal && " (original)"}
                      </VariationLink>
                    );
                  })}
                </VariationCard>
              )}
            </>
          )}
          <RecipeImage src={currentRecipe.recipeImageUrl} />
        </TitlePage>
        {/* IMAGE */}
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
                    //TO DO MAKE THE WIDTH MATCH THE SIZE OF THE CONTAINER
                    // size={widthIngredients.current.offsetWidth / 15}
                    size="25"
                    disabled={!toggleEdit}
                    type="text"
                    value={ingredient.ingredient}
                    onFocus={(e) => e.currentTarget.select()}
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
              <SubHeader>Step {directionIndex + 1}</SubHeader>
              <DirectionCard>
                <textarea
                  rows={direction.direction.length / 25}
                  cols="50"
                  disabled={!toggleEdit}
                  onFocus={(e) => e.currentTarget.select()}
                  value={direction.direction}
                  onChange={(e) => updateDirections(e, directionIndex)}
                ></textarea>
                {/* ADD A PAGE TO RECIPE - after current page */}
                <AddStep
                  currentRecipe={currentRecipe}
                  setCurrentRecipe={setCurrentRecipe}
                  directionIndex={directionIndex}
                />
              </DirectionCard>
              {/* ingredients */}
              <IngredientCard>
                {/* <h1>Ingredients</h1> */}

                <IngredientsPopOut
                  key={"ingredients-" + directionIndex}
                  direction={direction}
                  directionIndex={directionIndex}
                  ingredients={direction.ingredients}
                  toggleEdit={toggleEdit}
                  currentRecipe={currentRecipe}
                  setCurrentRecipe={setCurrentRecipe}
                  // updateDirectionIngredient={(e) =>
                  //   REupdateDirectionIngredient(e, directionIndex)
                  // }
                  updatePageDirections={(e) =>
                    updateDirectionsIngredientsLink(e, directionIndex)
                  }
                  //  view checkboxes
                  // update checkboxes
                  // toggle edit
                />

                {/* THIS WORKS VV */}
                {/* {direction.ingredients.map((ingredient, ingredientIndex) => {
                  return (
                    <>
                      <IngredientLine>
                        <input
                          class="ingredient-card"
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
                })} */}
                {/* THIS WORKS /\ /\ */}
                {/* CHECKBOXES TO LINK INGREDIENTS TO DIRECTION */}
                {currentRecipe.ingredients.map(
                  (ingredient, ingredientIndex) => {
                    let checkedIndex = currentRecipe.directions[
                      directionIndex
                    ].ingredients.findIndex(
                      (ing) => ing.ingredient === ingredient.ingredient
                    );
                    return (
                      toggleEdit &&
                      toggleIngredientCheckboxes && (
                        <label
                          for={directionIndex + "-" + ingredient.ingredient}
                        >
                          <input
                            checked={checkedIndex >= 0}
                            type="checkbox"
                            name="ingredient"
                            id={directionIndex + "-" + ingredient.ingredient}
                            name={ingredientIndex + "-" + ingredient.ingredient}
                            value={
                              currentRecipe.ingredients[ingredientIndex]
                                .ingredient
                            }
                            onChange={(e) => {
                              updateDirectionsIngredientsLink(
                                e,
                                directionIndex
                              );
                            }}
                          />
                          {ingredient.ingredient}
                        </label>
                      )
                    );
                  }
                )}
              </IngredientCard>
            </DirectionsPage>
          </Container>
        );
      })}
      {/* END DIRECTIONS PAGE */}
      {/*  */}
      {/* EDIT BUTTONS - must be signed in to edit a recipe */}
      {user.isSignedIn && (
        <>
          {/* SUBMIT BUTTON */}
          <EditButtonContainer style={{ left: "0" }}>
            {/* TIPPI here */}
            <EditRecipeIcon
              tabIndex="1"
              class="edit-recipe-btn"
              onClick={() => handleSubmitChanges()}
            >
              <ImCheckmark2 size={60} />
            </EditRecipeIcon>
          </EditButtonContainer>
          {/* EDIT BUTTON */}
          <EditButtonContainer style={{ right: "0" }}>
            <EditRecipeIcon
              tabIndex="1"
              toggleEdit={toggleEdit}
              class="edit-recipe-btn"
              onClick={(e) => {
                setToggleEdit(!toggleEdit);
                setToggleIngredientCheckboxes(false);
              }}
            >
              <TiPencil size={60} />
            </EditRecipeIcon>
          </EditButtonContainer>
        </>
      )}
    </PageWrapper>
  ) : (
    // LOADING
    <Wrapper>
      <Loading />
    </Wrapper>
  );
};
const EditRecipeIcon = styled.div`
  color: ${(props) => (props.toggleEdit ? "white" : "black")};
  opacity: ${(props) => (props.toggleEdit ? ".8" : ".2")};
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  padding: 5px;
  background-color: ${(props) =>
    props.toggleEdit ? "green" : "rgba(255, 255, 255, 0.2)"};
  :hover {
    opacity: 0.8;
    background-color: ${(props) => (props.toggleEdit ? "green" : "white")};
    color: ${(props) => (props.toggleEdit ? "white" : "black")};
  }
  :active {
    transform: scale(0.9);
  }
  :focus {
    opacity: 0.8;
    background-color: ${(props) => (props.toggleEdit ? "green" : "white")};
    color: ${(props) => (props.toggleEdit ? "white" : "black")};
    box-shadow: 0 0 10px green, 0 0 0 5px green;
  }
`;
const EditButtonContainer = styled.div`
  position: fixed;
  padding: 10px 20px;
  bottom: 2%;
  z-index: 9999;
`;

const VariationLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 2rem;
  text-align: center;
  justify-content: center;
  margin-top: 20px;
  margin: 5px auto;
  padding: 20px;
  border-radius: 10px;
  &:hover {
    text-shadow: 0 0 5px white;
    box-shadow: 0 0 0 2px white;
  }
  &:active {
    color: black;
    background-color: white;
  }
`;
const VariationCard = styled.div`
  padding: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: rgba(0, 0, 0, 1);
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
const DirectionsPage = styled.div`
  position: relative;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;
const DirectionCard = styled.div`
  position: relative;
  margin-top: 2rem;
  margin-right: 10px;
  box-shadow: var(--recipe-box-shadow);
  textarea {
    padding: 20px;
    font-size: 1.2rem;
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
//ingredients in each direction
const IngredientCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  position: absolute;
  bottom: 20%;
  background-color: white;
  width: 80%;

  .ingredient-card {
    font-size: 0.8rem;
  }
`;

const IngredientLine = styled.div`
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;
const IngredientList = styled.div`
  margin-top: 2rem;
  display: flex;
  overflow-y: scroll;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-shadow: var(--recipe-box-shadow);
`;

const IngredientsPage = styled.div`
  padding: 20px;
  /* padding: var(--recipe-page-padding); */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SubHeader = styled.div`
  font-size: 1.5rem;
`;

const AuthorCard = styled.div`
  padding: 20px;
  text-align: center;
  h1 {
    font-size: 1.5rem;
  }
  background-color: rgba(255, 255, 255, 0.5);
  text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.8),
    2px 2px 5px rgba(255, 255, 255, 0.5);
`;
const UserLink = styled(Link)`
  :hover {
    box-shadow: 0 0 0 2px black, 2px 2px 3px 1px rgba(0, 0, 0, 0.5);
  }
  :active {
    color: white;
    background-color: black;
    box-shadow: 0 0 4px 2px white inset, 0 0 2px black;
  }
`;
const RecipeImage = styled.img`
  height: 100%;
  width: auto;
  position: absolute;
  z-index: -10;
`;

const Title = styled.div`
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
`;
const TitlePage = styled.div`
  height: 100%;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  input.title {
    border: none;
    box-shadow: none;
    outline: none;
    text-align-last: center;
    caret-color: blue;
    font-size: 2rem;
    padding: 0 1rem;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.5);
    text-shadow: 0px 0px 2px rgba(255, 255, 255, 0.8),
      2px 2px 5px rgba(255, 255, 255, 0.5);
  }

  & input:disabled.title {
    color: black;
    opacity: 1;
  }
  input:focus-within.title {
    border: 5px solid blue;
  }
  input:focus.title {
    outline: 20px solid blue;
    box-shadow: 0 0 10px blue;
  }

  input:invalid.title {
    outline: 2px solid red;
    box-shadow: 0 0 5px red;
  }
`;
const Container = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
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
  input {
    background-color: transparent;
    font-size: 1rem;
    text-align: left;
    size: 100%;
    outline: none;
    border: none;
    box-shadow: none;
    color: black;
  }
  textarea:disabled,
  input:disabled {
    color: black;
    opacity: 1;
  }
  input:focus-within {
    border-bottom: 2px solid blue;
    outline: none;
    box-shadow: 0 1px 2px blue;
  }
  input:focus {
    border-bottom: 2px solid blue;
    outline: none;
  }
`;

const PageWrapper = styled.div`
  padding: 0;
  position: relative;
  margin: 0;
  height: 100vh;
  overflow: scroll;
  scroll-snap-type: mandatory;
  scroll-snap-type: y mandatory;
  scroll-snap-points-y: repeat(100vh);
  scroll-behavior: smooth;
`;

export default RecipePage;
