import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";

const IngredientsPopOut = ({
  direction,
  ingredients,
  toggleEdit,
  currentRecipe,
  directionIndex,
  updatePageDirections,

  setCurrentRecipe,
}) => {
  const [open, setOpen] = useState(false);
  const [viewCheckboxes, setViewCheckboxes] = useState(false);
  // console.log("current recipe POPOUT", currentRecipe);

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

  return (
    ingredients.length > 0 && (
      <Container onClick={() => !open && setOpen(true)} open={open}>
        {/* view other menu with checkboxes */}
        {toggleEdit && (
          <ViewCheckboxes>
            <button
              onClick={() => setViewCheckboxes(!viewCheckboxes)}
              type="button"
            >
              8
            </button>
          </ViewCheckboxes>
        )}
        <Title onClick={() => setOpen(!open)}>Ingredients in this step:</Title>
        <IngredientCard viewCheckboxes={viewCheckboxes}>
          <IngredientList>
            {ingredients.map((ingredient, ingredientIndex) => {
              return (
                <input
                  onChange={(e) =>
                    updateDirectionIngredient(
                      e,
                      ingredientIndex,
                      directionIndex
                    )
                  }
                  size="30"
                  type="text"
                  value={ingredient.ingredient}
                  disabled={!toggleEdit}
                />
              );
            })}
          </IngredientList>
          <IngredientCheckboxes viewCheckboxes={viewCheckboxes}>
            {currentRecipe.ingredients.map((ingredient, ingredientIndex) => {
              let checkedIndex = currentRecipe.directions[
                directionIndex
              ].ingredients.findIndex(
                (ing) => ing.ingredient === ingredient.ingredient
              );
              return (
                <label for={directionIndex + "-" + ingredient.ingredient}>
                  <input
                    checked={checkedIndex >= 0}
                    type="checkbox"
                    name="ingredient"
                    // id={directionIndex + "-" + ingredient.ingredient}
                    name={ingredientIndex + "-" + ingredient.ingredient}
                    value={
                      currentRecipe.ingredients[ingredientIndex].ingredient
                    }
                    onChange={updatePageDirections}
                  />
                  {ingredient.ingredient}
                </label>
              );
            })}
          </IngredientCheckboxes>
        </IngredientCard>
        <Icon onClick={() => setOpen(!open)} open={open}>
          <IoIosArrowDown size={20} />
        </Icon>
      </Container>
    )
  );
};
const IngredientCard = styled.div`
  /* position: absolute; */
  /* border: 4px solid orange; */
  display: flex;
  flex-direction: row;
  /* overflow-y: scroll; */
  overflow: hidden;
  height: 100%;
  width: 200%;
  transition: transform 1s ease-in-out;
  transform: ${(props) =>
    props.viewCheckboxes ? "translateX(-50%)" : "translateX(0%)"};
`;

const IngredientList = styled.div`
  /* position: relative; */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* margin-left: auto; */
  /* margin: 0 auto; */
  /* padding: 0 10px; */
  /* flex-grow: 1; */
`;

const IngredientCheckboxes = styled.div`
  width: 100%;
  height: ${(props) => (props.viewCheckboxes ? "100%" : "100px")};
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;

const ViewCheckboxes = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
const Icon = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 5px;
  /* border: 2px solid red; */
  border-radius: 50%;
  transition: transform 0.8s cubic-bezier(0.89, -0.01, 0.68, 0.93);
  transform: translate(-50%, -0%)
    ${(props) => (props.open ? "rotate(0deg)" : "rotate(180deg)")};
  :hover {
    color: ${(props) => (props.open ? "white" : "black")};
    background-color: ${(props) =>
      props.open ? "var(--primary-color)" : "none"};
  }
`;

const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  max-height: ${(props) => (props.open ? "400px" : "100px")};
  transition: max-height 0.8s ease-in-out;
  opacity: 0.8;
  background: ${(props) =>
    props.open
      ? ""
      : "  linear-gradient(0deg, rgba(172,172,172,0.9920343137254902) 0%, rgba(255,255,255,0) 19%) "};

  /* box-shadow: 10px 10px 0 5px var(--primary-color),
    0 0 5px 0px rgba(0, 0, 0, 0.3); */

  border: 2px solid var(--primary-color);
`;

const Title = styled.div`
  font-size: 1.1rem;
  padding: 10px;
`;
export default IngredientsPopOut;
