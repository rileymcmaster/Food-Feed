import React from "react";

const AddStep = ({ currentRecipe, setCurrentRecipe, directionIndex }) => {
  const currentRecipeCopy = { ...currentRecipe };
  const newDirectionPage = { direction: "Tell me what to do", ingredients: [] };
  const addNewPage = () => {
    console.log("copy1", currentRecipeCopy);
    currentRecipeCopy.directions.splice(
      directionIndex + 1,
      0,
      newDirectionPage
    );
    setCurrentRecipe(currentRecipeCopy);
  };

  return (
    <button type="button" onClick={() => addNewPage()}>
      Add step after this one
    </button>
  );
};

export default AddStep;
