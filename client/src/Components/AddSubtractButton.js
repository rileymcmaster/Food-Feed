import React from "react";
import styled from "styled-components";
//TODO GET ICONS AND STYLE THESE BUTTONS

const AddSubstractButton = ({ state, setState, modifier }) => {
  if (modifier === "add") {
    return (
      <button type="button" onClick={() => setState(state + 1)}>
        +
      </button>
    );
  } else if (modifier === "subtract") {
    return (
      <button
        type="button"
        onClick={() => {
          if (state > 1) {
            setState(state - 1);
          }
        }}
      >
        -
      </button>
    );
  } else if (modifier === "newIngredient") {
    return (
      <button
        type="button"
        onClick={() => {
          setState({
            ...state,
            ingredients: [
              ...state.ingredients,
              { ingredient: "new ingredient" },
            ],
          });
        }}
      >
        +
      </button>
    );
  }
  //BUGGY - makes the add ingredient break
  //   else if (modifier === "lessIngredient") {
  //     const stateCopy = { ...state };
  //     console.log("stateCopy", stateCopy);
  //     const ingredientsLength = stateCopy.ingredients.length - 1;
  //     console.log("ing length", ingredientsLength);
  //     stateCopy.ingredients.splice(ingredientsLength, 1);
  //     console.log("stateCopy2", stateCopy);
  //     return (
  //       <button
  //         type="button"
  //         onClick={() => {
  //           // setState({
  //           //   ...state,
  //           //   ingredients: [...stateCopy.ingredients],
  //           // });
  //         }}
  //       >
  //         -
  //       </button>
  //     );
  //   }
};

export default AddSubstractButton;
