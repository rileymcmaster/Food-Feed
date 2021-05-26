import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useMediaQuery from "../useMediaQuery";
// icons
import { IoIosArrowDown } from "react-icons/io";
import { FaLink } from "react-icons/fa";

const IngredientsPopOut = ({
  ingredients,
  toggleEdit,
  currentRecipe,
  directionIndex,
  updatePageDirections,
  setCurrentRecipe,
}) => {
  // MEDIA QUERY - Break point is 800px
  let mediaQuery = useMediaQuery();

  const [open, setOpen] = useState(false);
  const [viewCheckboxes, setViewCheckboxes] = useState(false);

  // EDIT AND UPDATE INGREDIENTS RIGHT IN THE POPUP WINDOW
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
    currentRecipeCopy.directions[directionIndex].ingredients[ingredientIndex] =
      { ingredient: e.target.value };
    setCurrentRecipe(currentRecipeCopy);
  };
  //if not editing or have the window expanded then you can't see the checkboxes
  useEffect(() => {
    if (!open || !toggleEdit) {
      setViewCheckboxes(false);
    }
    // if (mediaQuery) {
    //   setOpen(true);
    // }
  }, [open, toggleEdit, mediaQuery]);

  return (
    // IF NO INGREDIENTS TO SHOW - default to show nothing
    // IF NO ingredients but toggleEdit then show the chain icon and you can link ingredients
    ingredients.length <= 0 && !toggleEdit && !open ? (
      <></>
    ) : ingredients.length <= 0 && toggleEdit && !open ? (
      <ViewCheckboxesAlt>
        <button
          onClick={() => {
            setViewCheckboxes(!viewCheckboxes);
            setOpen(true);
          }}
          type="button"
        >
          <FaLink size={20} />
        </button>
      </ViewCheckboxesAlt>
    ) : (
      // SHOW INGREDIENTS
      // Click anywhere on container to open it
      <Container onClick={() => !open && setOpen(true)} open={open}>
        {/* BUTTON to view CHECKBOXES  */}
        {toggleEdit && open && (
          <ViewCheckboxes>
            <button
              onClick={() => setViewCheckboxes(!viewCheckboxes)}
              type="button"
            >
              <FaLink size={20} />
            </button>
          </ViewCheckboxes>
        )}
        {/* Click on title line to close */}
        <Title onClick={() => setOpen(!open)}>Ingredients in this step:</Title>
        <IngredientCard open={open} viewCheckboxes={viewCheckboxes}>
          <IngredientList>
            {ingredients.map((ingredient, ingredientIndex) => {
              //  RENDER ALL THE INGREDIENTS LINKED
              return (
                <input
                  key={`${ingredientIndex}-${ingredient}`}
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
          {/* CHECKBOXES */}
          <IngredientCheckboxes viewCheckboxes={viewCheckboxes}>
            {currentRecipe.ingredients.map((ingredient, ingredientIndex) => {
              let checkedIndex = currentRecipe.directions[
                directionIndex
              ].ingredients.findIndex(
                (ing) => ing.ingredient === ingredient.ingredient
              );
              return (
                <label
                  key={directionIndex + "-" + ingredient.ingredient}
                  htmlFor={directionIndex + "-" + ingredient.ingredient}
                >
                  <input
                    disabled={!toggleEdit}
                    checked={checkedIndex >= 0}
                    type="checkbox"
                    name="ingredient"
                    id={directionIndex + "-" + ingredient.ingredient}
                    name={directionIndex + "-" + ingredient.ingredient}
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
        {/* OPEN/CLOSE BUTTON */}
        {/* {mediaQuery && ( */}
        <Icon onClick={() => setOpen(!open)} open={open}>
          <IoIosArrowDown size={20} />
        </Icon>
        {/* )} */}
      </Container>
    )
  );
};
//contains everything
const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  opacity: 0.8;
  transition: max-height 0.8s ease-in-out;
  max-height: ${(props) => (props.open ? "400px" : "100px")};
  background: ${(props) =>
    props.open
      ? ""
      : "  linear-gradient(0deg, rgba(172,172,172,0.9920343137254902) 0%, rgba(255,255,255,0) 19%) "};
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.5);
`;
// ICON TO VIEW CHECKBOXES
const ViewCheckboxes = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  button {
    display: flex;
    justify-content: center;
    padding: 5px;
    outline: none;
    background-color: black;
    border-radius: 20px;
    color: white;
    :active {
      background-color: white;
      color: black;
    }
  }
`;
const ViewCheckboxesAlt = styled(ViewCheckboxes)`
  right: 50%;
  transform: translate(50%, -30px);
`;
// TITLE
const Title = styled.div`
  font-size: 1.1rem;
  padding: 10px;
`;
// The card that holds both lists of ingredients
const IngredientCard = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  width: 200%;
  min-height: 200px;
  transition: transform 1s ease-in-out;
  transform: ${(props) =>
    props.viewCheckboxes ? "translateX(-50%)" : "translateX(0%)"};
`;
// The ingredients that are linked to the current step
const IngredientList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
  padding-bottom: 1rem;
`;
// checkboxes for all ingredients to be able to link them to the current step
const IngredientCheckboxes = styled.div`
  width: 100%;
  min-height: ${(props) => (props.viewCheckboxes ? "300px" : "100px")};
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`;
// expand/retract icon
const Icon = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  left: 50%;
  padding: 2px;
  border: ${(props) =>
    props.open ? "2px solid var(--primary-color)" : "none"};
  background-color: white;
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

export default IngredientsPopOut;
