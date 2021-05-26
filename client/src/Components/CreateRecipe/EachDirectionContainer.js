import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { IoIosCloseCircle } from "react-icons/io";

const EachDirectionContainer = ({
  direction,
  ingredients,
  index,
  directionChange,
  clickFunction,
  value,
  ingredientChange,
}) => {
  // SHOW/HIDE the ingredient checkboxes
  const [open, setOpen] = useState(false);
  // will set the checked value if it is connected to a direction
  const checkedIngredient = (checkboxValue) => {
    let index = direction.ingredients.findIndex((ingredient) => {
      return ingredient.ingredient === checkboxValue;
    });

    if (index >= 0) {
      return true;
    } else return false;
  };

  return (
    <Container>
      {/* DIRECTION */}
      <DirectionLine>
        <input
          onFocus={() => setOpen(!open)}
          type="text"
          value={value}
          onChange={directionChange}
          placeholder={`Step ${index + 1}`}
        />
        <button className="remove-button" type="button" onClick={clickFunction}>
          <IoIosCloseCircle size={30} />
        </button>
      </DirectionLine>
      {open && (
        //   INGREDIENT
        //   CHECKBOXES
        <IngredientBoxes>
          <div>
            {ingredients.map((ingredient, idx) => {
              if (ingredient.ingredient) {
                return (
                  <>
                    <label htmlFor={`${index}-${ingredient.ingredient}`}>
                      <input
                        checked={checkedIngredient(ingredients[idx].ingredient)}
                        className="checkbox"
                        type="checkbox"
                        name="ingredient"
                        value={ingredients[idx].ingredient}
                        id={`${index}-${ingredient.ingredient}`}
                        onChange={ingredientChange}
                      />
                      {ingredient.ingredient}
                    </label>
                  </>
                );
              }
            })}
          </div>
        </IngredientBoxes>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: all 2s ease;
`;

const DirectionLine = styled.div`
  z-index: 2;
  transition: all 2s ease;
  position: relative;
  display: flex;
  justify-content: center;
  & input {
    width: 90%;
    margin-bottom: 2px;
  }
`;

const growDown = keyframes`
from {
  transform: translateY(-60%);

  opacity: 0%;
}
to{
    transform: translateY(0%);
    opacity: 100%;
}

`;
const IngredientBoxes = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transform-origin: top center;
  animation: ${growDown} 300ms ease-in-out forwards;
  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
`;

export default EachDirectionContainer;
