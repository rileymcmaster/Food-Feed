import React from "react";
import styled from "styled-components";

const AddStep = ({
  currentRecipe,
  setCurrentRecipe,
  directionIndex,
  children,
  modifier,
}) => {
  const currentRecipeCopy = { ...currentRecipe };
  const newDirectionPage = { direction: "Tell me what to do", ingredients: [] };
  const addNewPage = () => {
    currentRecipeCopy.directions.splice(
      directionIndex + 1,
      0,
      newDirectionPage
    );
    setCurrentRecipe(currentRecipeCopy);
  };
  const removePage = () => {
    currentRecipeCopy.directions.splice(directionIndex, 1);
    setCurrentRecipe(currentRecipeCopy);
  };

  if (modifier === "add-page") {
    return (
      <Button type="button" onClick={() => addNewPage()}>
        {children}
      </Button>
    );
  }
  if (modifier === "remove-page") {
    return (
      <Button type="button" onClick={() => removePage()}>
        {children}
      </Button>
    );
  }
};

const Button = styled.div`
  border: none;
  outline: none;
  background-color: transparent;
`;

export default AddStep;
