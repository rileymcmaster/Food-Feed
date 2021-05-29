import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
// components
import IngredientsPopOut from "./IngredientsPopOut";
import useMediaQuery from "../useMediaQuery";
import { editRecipe } from "../actions";
import AddStep from "../Buttons/AddStep";
// icons
import { CgPlayListAdd } from "react-icons/cg";
import { IoIosCloseCircle } from "react-icons/io";
import { BsFillTrashFill } from "react-icons/bs";

const DirectionPage = ({ direction, directionIndex, toggleEdit }) => {
  const currentRecipe = useSelector((state) => state.recipe);
  const dispatch = useDispatch();
  // MEDIA QUERY - Break point is 800px
  let mediaQuery = useMediaQuery();

  const [removePagePrompt, setRemovePagePrompt] = useState(false);

  const updateDirections = (e, index) => {
    const currentRecipeCopy = { ...currentRecipe };
    currentRecipeCopy.directions[index].direction = e.target.value;
    dispatch(editRecipe(currentRecipeCopy));
  };
  //
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
    dispatch(editRecipe(currentRecipeCopy));
  };
  //
  //
  //
  return (
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
            <AddStep
              modifier={"add-page"}
              currentRecipe={currentRecipe}
              setCurrentRecipe={(updatedRecipe) =>
                dispatch(editRecipe(updatedRecipe))
              }
              directionIndex={directionIndex}
            >
              <AddPageButton>
                <CgPlayListAdd size={30} />
              </AddPageButton>
            </AddStep>
            {!removePagePrompt ? (
              <RemovePageButton onClick={() => setRemovePagePrompt(true)}>
                <IoIosCloseCircle size={25} />
              </RemovePageButton>
            ) : removePagePrompt ? (
              <>
                {/* CONFIRM - remove page */}
                <AddStep
                  modifier={"remove-page"}
                  currentRecipe={currentRecipe}
                  setCurrentRecipe={(updatedRecipe) =>
                    dispatch(editRecipe(updatedRecipe))
                  }
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
                <RemovePageButton onClick={() => setRemovePagePrompt(false)}>
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

      <IngredientCard>
        <IngredientsPopOut
          key={"ingredients-" + directionIndex}
          direction={direction}
          directionIndex={directionIndex}
          ingredients={direction.ingredients}
          toggleEdit={toggleEdit}
          updatePageDirections={(e) =>
            updateDirectionsIngredientsLink(e, directionIndex)
          }
        />
      </IngredientCard>
    </DirectionsPage>
    // </Container>
  );
};

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
  max-height: 60%;
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
    overflow-x: auto;
  }
  textarea:focus {
    box-shadow: 0 0 10px blue;
  }
`;

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

const RemovePageButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  right: 0;
  top: 0px;
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

const DeleteMessage = styled.div`
  padding: 5px;
  background-color: red;
  color: white;
  position: absolute;
  top: 2rem;
  right: 0;
`;

export default DirectionPage;
