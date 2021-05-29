import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchRecipe, loadRecipe, loadRecipeError } from "../actions";

import styled from "styled-components";
import useMediaQuery from "../useMediaQuery";
// imported components
import Wrapper from "../Wrapper";
import Loading from "../Loading";
import TitlePage from "./TitlePage";
import IngredientsPage from "./IngredientsPage";
import DirectionPage from "./DirectionPage";
import ConfirmSubmitPopup from "./ConfirmSubmitPopup";

// icons
import { TiPencil } from "react-icons/ti";
import { ImCheckmark2 } from "react-icons/im";

const RecipePage = () => {
  const user = useSelector((state) => state.user);
  const newRecipeMethod = useSelector((state) => state.recipe);
  // MEDIA QUERY - Break point is 800px
  let mediaQuery = useMediaQuery();

  const dispatch = useDispatch();

  const urlId = useParams()._id;

  const [currentRecipe, setCurrentRecipe] = useState(null);
  // loading states
  const [firstFetch, setFirstFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  // editing states
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editedRecipeObject, setEditedRecipeObject] = useState(null);
  // sending recipe states
  const [confirmSendRecipe, setConfirmSendRecipe] = useState(false);

  const history = useHistory();

  //FETCH RECIPE
  useEffect(() => {
    dispatch(fetchRecipe());
    setFirstFetch(false);
    setLoading(true);
    fetch(`https://food-feed.herokuapp.com/recipes/${urlId}`)
      .then((res) => res.json())
      .then(({ status, data, message }) => {
        if (status === 200) {
          setCurrentRecipe(data);
          dispatch(loadRecipe(data));
        } else {
          dispatch(loadRecipeError());
          console.log("status", status);
          console.log("error message: ", message);
          history.push("/error");
        }
      })
      .then(() => setFirstFetch(true))
      .catch((err) => console.log("error getting recipe", err));
    setLoading(false);
  }, [urlId, history]);

  return !currentRecipe || loading ? (
    // LOADING
    <Wrapper>
      <Loading />
    </Wrapper>
  ) : (
    <PageWrapper>
      {/* TITLEPAGE */}
      <Container confirmSendRecipe={confirmSendRecipe}>
        <TitlePage />
      </Container>
      {/* INGREDIENTS PAGE */}
      <Container confirmSendRecipe={confirmSendRecipe}>
        <IngredientsPage toggleEdit={toggleEdit} />
      </Container>
      {/* DIRECTION PAGES */}
      {currentRecipe.directions.map((direction, directionIndex) => {
        return (
          <Container confirmSendRecipe={confirmSendRecipe}>
            <DirectionPage
              direction={direction}
              directionIndex={directionIndex}
              toggleEdit={toggleEdit}
            />
          </Container>
        );
      })}
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
        <ConfirmSubmitPopup
          confirmSendRecipe={confirmSendRecipe}
          setConfirmSendRecipe={setConfirmSendRecipe}
        />
      )}
    </PageWrapper>
  );
};

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

// const ConfirmButtonContainer = styled.div`
//   margin: auto;
//   display: block;
//   max-width: 200px;
//   .input {
//     font-size: 3rem;
//   }
//   h1 {
//     font-size: 2rem;
//   }
// `;

// const ConfirmCard = styled.div`
//   width: 100%;
//   padding: 2rem;
//   display: flex;
//   flex-direction: column;
//   box-shadow: var(--recipe-box-shadow);
//   background-color: rgba(255, 255, 255, 0.5);
//   max-width: 600px;
//   margin: auto;
//   gap: 2rem;
//   textarea {
//     resize: none;
//     text-align: center;
//     vertical-align: center;
//   }
// `;
// const ConfirmSendRecipe = styled.div`
//   position: fixed;
//   width: 100%;
//   height: 100%;
//   margin: auto;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   top: 0;
//   left: 0;
//   z-index: 999999999999999999;
// `;

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
