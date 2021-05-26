import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import useMediaQuery from "../useMediaQuery";
// imported components
import Wrapper from "../Wrapper";
import AddStep from "../Buttons/AddStep";
import Loading from "../Loading";
import ButtonUpload from "../Buttons/ButtonUpload";
import IngredientsPage from "./IngredientsPage";
import IngredientsPopOut from "./IngredientsPopOut";
// icons
import { TiPencil } from "react-icons/ti";
import { ImCheckmark2 } from "react-icons/im";
import { CgPlayListAdd } from "react-icons/cg";
import { IoIosCloseCircle } from "react-icons/io";
import { BsFillTrashFill } from "react-icons/bs";

const RecipePage = () => {
  // MEDIA QUERY - Break point is 800px
  let mediaQuery = useMediaQuery();
  //LOGGED IN USER
  const user = useSelector((state) => state.user);

  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [firstFetch, setFirstFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const [originalVariations, setOriginalVariations] = useState([]);
  const [showVariations, setShowVariations] = useState(false);
  const [removePagePrompt, setRemovePagePrompt] = useState(false);
  const [editedRecipeObject, setEditedRecipeObject] = useState(null);
  const [confirmSendRecipe, setConfirmSendRecipe] = useState(false);
  const [sendingRecipe, setSendingRecipe] = useState("");
  const [sendingRecipeComplete, setSendingRecipeComplete] = useState("");
  const [sendingRecipeError, setSendingRecipeError] = useState("");

  //get the params to fetch the recipe
  const urlId = useParams()._id;
  // refresh page when edited recipe is submitted
  const history = useHistory();

  //FETCH RECIPE
  useEffect(() => {
    setFirstFetch(false);
    setLoading(true);
    fetch(`https://food-feed.herokuapp.com/recipes/${urlId}`)
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
  }, [urlId, history]);
  //FETCH AUTHOR
  useEffect(() => {
    if (currentRecipe) {
      fetch(`https://food-feed.herokuapp.com/user/${currentRecipe.createdBy}`)
        .then((res) => res.json())
        .then((data) => {
          setAuthor(data.data);
        });
      if (currentRecipe.isOriginal) {
        setOriginalVariations(currentRecipe.variations);
      } else if (!currentRecipe.isOriginal) {
        fetch(
          `https://food-feed.herokuapp.com/recipes/${currentRecipe.originalRecipe}`
        )
          .then((res) => res.json())
          .then((data) => {
            setOriginalVariations([
              {
                isOriginal: true,
                variationId: data.data._id,
                variationTitle: data.data.recipeName,
              },
              ...data.data.variations,
            ]);
          });
      }
      setLoading(false);
    }
  }, [firstFetch, currentRecipe]);

  //EDITING - anything on the page
  const [toggleEdit, setToggleEdit] = useState(false);

  //UPDATE TITLE
  const updateTitle = (e) => {
    const currentRecipeCopy = { ...currentRecipe };
    currentRecipeCopy.recipeName = e.target.value;
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

  //SEND THE EDITED RECIPE TO SERVER
  const handleSubmitChanges = () => {
    setSendingRecipe("sending");
    const currentRecipeCopy = {
      ...currentRecipe,
      createdBy: user._id,
      isOriginal: false,
      date: "",
    };
    //keep the link to original recipe
    if (currentRecipe.isOriginal) {
      currentRecipeCopy.originalRecipe = currentRecipe._id;
    }
    fetch(`https://food-feed.herokuapp.com/recipes/create/edit`, {
      method: "POST",
      body: JSON.stringify(currentRecipeCopy),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ status, data }) => {
        if (status === 200) {
          setEditedRecipeObject(data);
          setSendingRecipe("");
          setSendingRecipeComplete("Recipe created!");
          setConfirmSendRecipe(false);
        } else {
          setSendingRecipe("");
          setSendingRecipeError("Error, try again");
        }
      })

      .catch((err) => {
        console.log("Error uploading recipe", err);
        setSendingRecipe("");
        setSendingRecipeError("Error, try again");
      });
  };
  // update the user's recipe array with the new edited recipe
  useEffect(() => {
    if (editedRecipeObject) {
      // UPDATE USER'S RECIPES ARRAY
      fetch(`https://food-feed.herokuapp.com/user/edit/recipe`, {
        method: "PATCH",
        body: JSON.stringify(editedRecipeObject),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then(() => history.push(`/recipe/${editedRecipeObject._id}`))
        .catch((err) => console.log("User's recipe array not updated", err));
    }
  }, [editedRecipeObject, history]);

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
  // RENDERED ON THE PAGE
  return currentRecipe && !loading && author ? (
    <PageWrapper>
      {/* TITLEPAGE */}
      <Container confirmSendRecipe={confirmSendRecipe}>
        {/* TITLE */}
        <TitlePage>
          <Title>{currentRecipe.recipeName}</Title>
          <>
            {/* AUTHOR */}
            <AuthorCard>
              {currentRecipe.isOriginal ? (
                <h2>Original recipe by:</h2>
              ) : (
                <h2>Recipe improved by:</h2>
              )}
              {/* LINK */}
              <UserLink to={`/user/${author._id}`}>
                <h1>@{author.handle}</h1>
              </UserLink>
            </AuthorCard>
            {/* VARIATIONS BUTTON */}
            <VariationButton
              tabIndex="0"
              onClick={() => setShowVariations(!showVariations)}
            >
              VARIATIONS
            </VariationButton>
            {/* VARIATIONS POPUP */}
            {originalVariations && showVariations && (
              <VariationCard showVariations={showVariations}>
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
          {/* IMAGE */}
          <RecipeImage src={currentRecipe.recipeImageUrl} />
        </TitlePage>
        {/* IMAGE */}
      </Container>
      {/* END TITLE PAGE */}
      {/*  */}
      {/* INGREDIENTS PAGE */}
      <Container confirmSendRecipe={confirmSendRecipe}>
        <IngredientsPage
          currentRecipe={currentRecipe}
          setCurrentRecipe={setCurrentRecipe}
          toggleEdit={toggleEdit}
        />
      </Container>
      {/*  */}
      {/* DIRECTION PAGES */}
      {/*  */}
      {currentRecipe.directions.map((direction, directionIndex) => {
        return (
          <Container confirmSendRecipe={confirmSendRecipe}>
            <DirectionsPage>
              <p>Step {directionIndex + 1}</p>
              <DirectionCard>
                <textarea
                  rows={
                    mediaQuery
                      ? direction.direction.length / 35
                      : direction.direction.length / 25
                  }
                  cols="50"
                  disabled={!toggleEdit}
                  onFocus={(e) => e.currentTarget.select()}
                  value={direction.direction}
                  onChange={(e) => updateDirections(e, directionIndex)}
                ></textarea>
                {toggleEdit && (
                  <>
                    {/* ADD A PAGE TO RECIPE - after current page */}
                    <AddStep
                      modifier={"add-page"}
                      currentRecipe={currentRecipe}
                      setCurrentRecipe={setCurrentRecipe}
                      directionIndex={directionIndex}
                    >
                      <AddPageButton>
                        <CgPlayListAdd size={30} />
                      </AddPageButton>
                    </AddStep>
                    {/* // REMOVE THIS PAGE */}
                    {!removePagePrompt ? (
                      <RemovePageButton
                        onClick={() => setRemovePagePrompt(true)}
                      >
                        <IoIosCloseCircle size={25} />
                      </RemovePageButton>
                    ) : removePagePrompt ? (
                      <>
                        {/* CONFIRM - remove page */}
                        <AddStep
                          modifier={"remove-page"}
                          currentRecipe={currentRecipe}
                          setCurrentRecipe={setCurrentRecipe}
                          directionIndex={directionIndex}
                        >
                          <RemovePageButton
                            onClick={() => setRemovePagePrompt(false)}
                            style={{ right: "80px" }}
                          >
                            <BsFillTrashFill size={25} />
                          </RemovePageButton>
                        </AddStep>
                        {/* CANCEL - don't remove page */}
                        <RemovePageButton
                          onClick={() => setRemovePagePrompt(false)}
                        >
                          <IoIosCloseCircle size={25} />{" "}
                        </RemovePageButton>
                        <DeleteMessage>delete this page?</DeleteMessage>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </DirectionCard>
              {/* ingredients for each direction page*/}
              <IngredientCard>
                <IngredientsPopOut
                  key={"ingredients-" + directionIndex}
                  direction={direction}
                  directionIndex={directionIndex}
                  ingredients={direction.ingredients}
                  toggleEdit={toggleEdit}
                  currentRecipe={currentRecipe}
                  setCurrentRecipe={setCurrentRecipe}
                  updatePageDirections={(e) =>
                    updateDirectionsIngredientsLink(e, directionIndex)
                  }
                />
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
          <EditButtonContainer className="submit">
            <EditRecipeIcon
              tabIndex="1"
              onClick={() => setConfirmSendRecipe(true)}
            >
              <ImCheckmark2 size={60} />
            </EditRecipeIcon>
          </EditButtonContainer>
          {/* EDIT BUTTON */}
          <EditButtonContainer
            className={
              mediaQuery ? "edit-toggle-desktop" : "edit-toggle-mobile"
            }
          >
            <EditRecipeIcon
              tabIndex="1"
              toggleEdit={toggleEdit}
              onClick={() => {
                setToggleEdit(!toggleEdit);
              }}
            >
              <TiPencil size={60} />
            </EditRecipeIcon>
          </EditButtonContainer>
        </>
      )}
      {/* END EDIT BUTTONS */}
      {/*  */}
      {/* POPUP WINDOW TO SUBMIT THE RECIPE */}
      {confirmSendRecipe && (
        <ConfirmSendRecipe>
          <ConfirmCard>
            {/* recipe name */}
            <h1>Name your creation:</h1>
            <textarea
              autoFocus
              onFocus={(e) => e.currentTarget.select()}
              rows="2"
              value={currentRecipe.recipeName}
              onChange={(e) => updateTitle(e)}
            ></textarea>
            {/* send button */}
            <ConfirmButtonContainer>
              <ButtonUpload
                className="submit"
                onClick={() => {
                  handleSubmitChanges();
                }}
                wait={sendingRecipe}
                fail={sendingRecipeError}
                success={sendingRecipeComplete}
              >
                <h1> SUBMIT</h1>
              </ButtonUpload>
            </ConfirmButtonContainer>
            {/* CANCEL button */}
            <ConfirmButtonContainer>
              <ButtonUpload onClick={() => setConfirmSendRecipe(false)}>
                cancel
              </ButtonUpload>
            </ConfirmButtonContainer>
          </ConfirmCard>
        </ConfirmSendRecipe>
      )}
      {/* END POPUP WINDOW */}
    </PageWrapper>
  ) : (
    // LOADING
    <Wrapper>
      <Loading />
    </Wrapper>
  );
};
//
// Container for the entire recipe
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
// Container for each page
const Container = styled.section`
  transition: filter 1s ease;
  filter: ${(props) => (props.confirmSendRecipe ? "blur(5px)" : "")};
  background: rgb(238, 238, 238);
  background: linear-gradient(
    0deg,
    rgba(238, 238, 238, 1) 0%,
    rgba(241, 241, 241, 0) 13%,
    rgba(255, 255, 255, 0) 84%,
    rgba(238, 238, 238, 1) 100%
  );
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  margin: 0 auto;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: hidden;
  z-index: 0;
  input,
  textarea {
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
  input:focus-within,
  textarea:focus-within {
    border-bottom: 2px solid blue;
    outline: none;
    box-shadow: 0 1px 2px blue;
  }
  input:focus,
  textarea:focus-within {
    border-bottom: 2px solid blue;
    outline: none;
  }
`;
// TITLE PAGE
const TitlePage = styled.div`
  height: 100%;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;
// NAME OF RECIPE
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
// Image that shows on first page
const RecipeImage = styled.img`
  height: 100%;
  width: auto;
  position: absolute;
  z-index: -10;
`;
// By line
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
// Link to user handle
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
// VARIATIONS
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
// Variations popup window
const VariationCard = styled.div`
  padding: 20px 20px 60px 20px;
  border-radius: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 1);
  min-width: 200px;
  max-width: 600px;
  height: 80vh;
  overflow-y: auto;
`;
// each link in the variations popup
const VariationLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-size: 1rem;
  text-align: center;
  justify-content: center;
  margin-top: 20px;
  padding: 5px;
  &::last-child {
    margin-bottom: 20px;
  }
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
// DIRECTIONS PAGES
const DirectionsPage = styled.div`
  position: relative;
  padding: 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  p {
    font-size: 1.5rem;
  }
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
  bottom: 3rem;
  background-color: white;
  width: 80%;
  .ingredient-card {
    font-size: 0.8rem;
  }
`;

const ConfirmButtonContainer = styled.div`
  margin: auto;
  display: block;
  max-width: 200px;
  .input {
    font-size: 3rem;
  }
  h1 {
    font-size: 2rem;
  }
`;
const ConfirmCard = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--recipe-box-shadow);
  background-color: rgba(255, 255, 255, 0.5);
  max-width: 600px;
  margin: auto;
  gap: 2rem;
  textarea {
    resize: none;
    text-align: center;
    vertical-align: center;
  }
`;
const ConfirmSendRecipe = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 999999999999999999;
`;

const DeleteMessage = styled.div`
  padding: 5px;
  background-color: red;
  color: white;
  position: absolute;
  top: 2rem;
  right: 0;
`;
const RemovePageButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  right: 0;
  top: 0px;
  /* padding: 2px; */
  border-radius: 50%;
  :hover,
  :focus {
    color: red;
  }
  :active {
    background-color: white;
    color: red;
    box-shadow: 0 0 0 4px red;
  }
`;

const AddPageButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0px;
  padding: 2px;
  :hover,
  :focus {
    background-color: black;
    color: white;
  }
  :active {
    background-color: white;
    color: black;
    box-shadow: 1px 1px 0 4px black;
  }
`;
const EditButtonContainer = styled.div`
  position: fixed;
  z-index: 9999;
  padding: 10px 20px;
  bottom: 2%;
  &.submit {
    left: 0;
  }
  &.edit-toggle-mobile {
    right: 0;
  }
  &.edit-toggle-desktop {
    left: 0;
    bottom: 120px;
  }
`;
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

export default RecipePage;
