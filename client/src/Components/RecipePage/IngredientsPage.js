import React from "react";
import styled from "styled-components";
import useMediaQuery from "../useMediaQuery";
import { BsPlusCircle } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";

const IngredientsPage = ({ currentRecipe, setCurrentRecipe, toggleEdit }) => {
  // media query
  let mediaQuery = useMediaQuery();

  //   Input onChange = UPDATE INGREDIENTS
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
  //   ADD INGREDIENT
  const handleAddIngredient = () => {
    setCurrentRecipe({
      ...currentRecipe,
      ingredients: [
        ...currentRecipe.ingredients,
        { ingredient: "New ingredient" },
      ],
    });
  };
  // REMOVE INGREDIENT
  const handleRemoveIngredient = (ingredientIndex) => {
    // make a copy of the form
    const currentRecipeCopy = { ...currentRecipe };
    // must be at least one ingredient
    if (currentRecipeCopy.ingredients.length > 1) {
      const remove = currentRecipeCopy.ingredients.splice(ingredientIndex, 1);
      setCurrentRecipe(currentRecipeCopy);
    }
  };

  return (
    <IngredientsPageContainer>
      <SubHeader>Ingredients:</SubHeader>
      <IngredientList>
        {currentRecipe.ingredients.map((ingredient, index) => {
          return (
            <IngredientLine>
              <input
                size={mediaQuery ? "80" : "30"}
                disabled={!toggleEdit}
                type="text"
                value={ingredient.ingredient}
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => updateIngredients(e, index)}
              ></input>
              {toggleEdit && (
                <button
                  className="remove-button"
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  <IoIosCloseCircle size={25} />
                </button>
              )}
            </IngredientLine>
          );
        })}
      </IngredientList>
      {toggleEdit && (
        <>
          <button
            className="add-button"
            type="button"
            onClick={() => {
              handleAddIngredient();
            }}
          >
            <BsPlusCircle size={35} />
          </button>
        </>
      )}
    </IngredientsPageContainer>
  );
};

const IngredientsPageContainer = styled.div`
  position: relative;
  /* margin: 5px; */
  /* width: 90%; */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  & button.add-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px auto;
    background-color: transparent;
    border: none;
    text-align: center;
    vertical-align: center;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    :hover,
    :focus {
      outline: none;
      background-color: var(--primary-color);
      color: white;
    }
    :active {
      box-shadow: 0 0 0 4px white, 0 0 0 8px var(--primary-color);
    }
  }
  & button.remove-button {
    /* transform: translateX(-20px); */
    height: 20px;
    background-color: transparent;
    border: none;
    padding: none;
    margin-left: -20px;
    :hover,
    :focus,
    :active {
      outline: none;
      color: red;
    }
  }
`;
const SubHeader = styled.div`
  font-size: 1.5rem;
`;
const IngredientList = styled.div`
  max-height: 80%;
  margin-top: 2rem;
  overflow-y: auto;
  box-shadow: var(--recipe-box-shadow);
`;

const IngredientLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 35px;
  padding-left: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export default IngredientsPage;
