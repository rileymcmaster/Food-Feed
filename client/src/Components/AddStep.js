import React from "react";

const AddStep = ({ currentRecipe, setCurrentRecipe, directionIndex }) => {
  console.log("currentRecipe", currentRecipe);
  console.log("direct I", directionIndex);
  const currentRecipeCopy = { ...currentRecipe };
  const newDirectionPage = { direction: "Tell me what to do", ingredients: [] };
  const addNewPage = () => {
    console.log("copy1", currentRecipeCopy);
    currentRecipeCopy.directions.splice(
      directionIndex + 1,
      0,
      newDirectionPage
    );
    console.log("copy2", currentRecipeCopy);
    setCurrentRecipe(currentRecipeCopy);
  };

  return (
    <button type="button" onClick={() => addNewPage()}>
      Add step
    </button>
  );
};

export default AddStep;
