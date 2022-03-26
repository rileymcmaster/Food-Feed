import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
// components
import useMediaQuery from "../useMediaQuery";
import { editRecipe } from "../actions";

// icons
import { BsPlusCircle } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";

const IngredientsPage = ({ toggleEdit }) => {
  const currentRecipe = useSelector((state) => state.recipe);
  const dispatch = useDispatch();

  // media query - breakpoint is 800px
  let mediaQuery = useMediaQuery();

  const updateIngredients = (e, index) => {
    const currentRecipeCopy = { ...currentRecipe };
    let filterDirections = currentRecipeCopy.directions.filter(
      (direction, i) => {
        let filterIngredients = direction.ingredients.filter(
          (ingredient, idx) => {
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
    dispatch(editRecipe(currentRecipeCopy));
  };

  const handleAddIngredient = () => {
    dispatch(
      editRecipe({
        ...currentRecipe,
        ingredients: [
          ...currentRecipe.ingredients,
          { ingredient: "New ingredient" },
        ],
      })
    );
  };

  const handleRemoveIngredient = (ingredientIndex) => {
    const currentRecipeCopy = { ...currentRecipe };
    if (currentRecipeCopy.ingredients.length > 1) {
      const remove = currentRecipeCopy.ingredients.splice(ingredientIndex, 1);
      dispatch(editRecipe(currentRecipeCopy));
    }
  };

  return (
    <IngredientsPageContainer>
      <h2>Ingredients:</h2>
      <IngredientList>
        {currentRecipe.ingredients.map((ingredient, index) => {
          return (
            <IngredientLine key={`ingredient-${index}`}>
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
  h2 {
    font-size: 1.5rem;
    font-weight: 500;
  }
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
