import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Wrapper from "./Wrapper";
import { useDispatch, useSelector } from "react-redux";
import AddSubstractButton from "./AddSubtractButton";

const RecipeForm = () => {
  //should only be able to submit recipe if signed in!!
  //USER STATE
  const user = useSelector((state) => state.user);

  //the recipe state that will be submitted
  const [userInput, setUserInput] = useState({
    recipeName: "",
    ingredients: [{ ingredient: "" }],
    directions: [{ direction: "", ingredients: [] }],
    isPrivate: false,
    createdBy: user._id,
    recipeImageUrl: "",
  });

  // INGREDIENTS INPUT
  const updateIngredients = (e, index) => {
    const userInputCopy = { ...userInput };
    //update the corresponding ingredient in DIRECTIONS
    userInputCopy.directions.filter((direction, i) => {
      direction.ingredients.filter((ingredient, idx) => {
        if (
          ingredient.ingredient === userInputCopy.ingredients[index].ingredient
        ) {
          return (direction.ingredients[idx] = { ingredient: e.target.value });
        }
      });
    });
    //update the ingredient
    userInputCopy.ingredients[index] = { ingredient: e.target.value };
    setUserInput(userInputCopy);
  };

  // DIRECTIONS INPUT pushes to the array in userInput
  const updateDirections = (e, directionIndex) => {
    const userInputCopy = { ...userInput };
    userInputCopy.directions[directionIndex] = {
      direction: e.target.value,
      ingredients: [],
    };
    setUserInput(userInputCopy);
  };
  //checkboxes for the ingredients inside directions
  const updateDirectionsIngredients = (e, directionIndex) => {
    //toggle insert/remove from array
    let userInputCopy = { ...userInput };
    const index = userInputCopy.directions[
      directionIndex
    ].ingredients.findIndex(
      (ingredient) => ingredient.ingredient === e.target.value
    );
    if (index >= 0) {
      userInputCopy.directions[directionIndex].ingredients.splice(index, 1);
    } else {
      userInputCopy.directions[directionIndex].ingredients = [
        ...userInputCopy.directions[directionIndex].ingredients,
        { ingredient: e.target.value },
      ];
    }
    setUserInput(userInputCopy);
  };

  console.log("USER", userInput);
  //toggle private setting
  const updatePrivate = () => {
    const userInputCopy = { ...userInput };
    userInputCopy.isPrivate = !userInputCopy.isPrivate;
    setUserInput(userInputCopy);
  };

  //IMAGE UPLOAD
  const [recipeImage, setRecipeImage] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadComplete, setImageUploadComplete] = useState(false);
  const sendImage = (ev) => {
    setImageUploading(true);
    const data = new FormData();
    data.append("file", recipeImage);
    data.append("upload_preset", "feed-preset");
    data.append("cloud_name", "bodyofwater");
    fetch("https://api.cloudinary.com/v1_1/bodyofwater/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("image upload successful!");
        setUserInput({ ...userInput, recipeImageUrl: data.url });
        setImageUploading(false);
        setImageUploadComplete(true);
      })
      .catch((err) => console.log("error", err));
  };
  //
  //SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/recipes/create", {
      method: "POST",
      body: JSON.stringify(userInput),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log("recipe has been uploaded", data));
  };

  // ADD INGREDIENT
  const handleAddIngredient = () => {
    // make a copy of the form
    const userInputCopy = { ...userInput };
    // new object that will be inserted
    const newIngredientObject = { ingredient: "" };
    // add object to end of array
    const ingredientLength = userInputCopy.ingredients.length;
    // splice changes original array, inserts the new object
    const addNewIngredient = userInputCopy.ingredients.splice(
      ingredientLength,
      0,
      newIngredientObject
    );
    setUserInput(userInputCopy);
  };

  // REMOVE INGREDIENT
  const handleRemoveIngredient = (ingredientIndex) => {
    // make a copy of the form
    const userInputCopy = { ...userInput };
    // must be at least one ingredient
    if (userInputCopy.ingredients.length > 1) {
      const remove = userInputCopy.ingredients.splice(ingredientIndex, 1);
      setUserInput(userInputCopy);
    }
  };
  // ADD DIRECTION
  const handleAddDirection = () => {
    // make a copy of the form
    const userInputCopy = { ...userInput };
    // new object that will be inserted
    const newDirectionObject = { direction: "", ingredients: [] };
    // add object to end of array
    const directionLength = userInputCopy.directions.length;
    // splice changes original array, inserts the new object
    const addNewDirection = userInputCopy.directions.splice(
      directionLength,
      0,
      newDirectionObject
    );
    setUserInput(userInputCopy);
  };

  // console.log("userinput", userInput);

  // REMOVE DIRECTION
  const handleRemoveDirection = (directionIndex) => {
    console.log("d in", directionIndex);
    // make a copy of the form
    const userInputCopy = { ...userInput };
    // there must be at least one direction
    if (userInputCopy.directions.length > 1) {
      const remove = userInputCopy.directions.splice(directionIndex, 1);
      setUserInput(userInputCopy);
    }
  };

  return (
    <Wrapper>
      <FormContainer>
        <form onSubmit={handleSubmit} enctype="multipart/form-data">
          {/* RECIPE NAME */}
          <div>
            <label for="recipeName">Recipe name:</label>
            <input
              autoFocus
              type="text"
              placeholder="Name of dish"
              name="recipeName"
              required
              value={userInput.recipeName}
              onChange={(e) =>
                setUserInput({ ...userInput, recipeName: e.target.value })
              }
            />
          </div>
          {/* INGREDIENTS */}
          <h1>INGREDIENTS:</h1>
          {/* {numIngredientsArray.map((num, index) => { */}
          {userInput.ingredients.map((ingredient, index) => {
            return (
              <IngredientInput>
                <label for={`ingredient-${index}`}>
                  Ingredient {index + 1}:
                </label>
                <input
                  type="text"
                  placeholder="ingredient"
                  name={`ingredient`}
                  value={userInput.ingredients[index].ingredient}
                  onChange={(e) => updateIngredients(e, index)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  X
                </button>
              </IngredientInput>
            );
          })}
          {/* MORE INGREDIENTS */}
          <button type="button" onClick={() => handleAddIngredient()}>
            ADD
          </button>
          {/* END INGREDIENTS */}
          {/* DIRECTIONS */}
          <h1>DIRECTIONS:</h1>
          {userInput.directions.map((direction, index) => {
            return (
              <div>
                <label for={`direction-${index}`}>Step {index + 1}:</label>
                <input
                  type="text"
                  placeholder="what to do"
                  name={`direction`}
                  value={userInput.directions[index].direction}
                  onChange={(e) => updateDirections(e, index)}
                />
                {/* REMOVE THIS DIRECTION */}
                <button
                  type="button"
                  onClick={() => handleRemoveDirection(index)}
                >
                  X
                </button>
                {/* INGREDIENT CHECKBOXES */}
                {userInput.ingredients.map((ingredient, idx) => {
                  return (
                    <div>
                      <label for={`${index}-${ingredient.ingredient}`}>
                        <input
                          type="checkbox"
                          name="ingredient"
                          class={index}
                          value={userInput.ingredients[idx].ingredient}
                          // value={ingredient.ingredient}
                          id={`${index}-${ingredient.ingredient}`}
                          onChange={(e) => {
                            updateDirectionsIngredients(e, index, idx);
                          }}
                        />
                        {ingredient.ingredient}
                      </label>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {/* MORE DIRECTIONS */}
          <button
            type="button"
            onClick={() => {
              handleAddDirection();
            }}
          >
            ADD
          </button>
          {/* PRIVATE CHECKBOX */}
          <div>
            <label for="isPrivate">
              <input
                type="checkbox"
                name="isPrivate"
                value="isPrivate"
                onChange={updatePrivate}
              />
              Private (only you will be able to see this recipe)
            </label>
          </div>
          {/* UPLOAD IMAGE */}
          <div>
            <input
              type="file"
              name="uploadImage"
              onChange={(e) => {
                const file = e.target.files[0];
                setRecipeImage(file);
              }}
            />
            <button
              type="button"
              onClick={() => {
                sendImage();
                setRecipeImage({});
              }}
            >
              upload picture
            </button>
            {imageUploading && <h1>image is uploading</h1>}
            {imageUploadComplete && <h1>Upload is complete!</h1>}
          </div>
          {/* END UPLOAD IMAGE */}
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </FormContainer>
    </Wrapper>
  );
};
const IngredientInput = styled.div`
  display: flex;
  flex-direction: row;
  /* border: 2px solid red; */
`;
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
  /* width: 100%; */
  justify-content: center;
  align-items: center;
  text-align: center;
  /* background-color: lightblue; */

  div {
    /* border: 2px solid red; */
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  label {
    margin-bottom: 0.5rem;
  }
  input,
  textarea {
    /* margin-top: 0.5rem; */
    border: none;
    padding: 5px;
    font-size: 1.2rem;
    text-align: center;
    outline: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    vertical-align: center;
  }

  textarea {
    resize: none;
  }
  input:focus-within {
    outline: 2px solid blue;
  }

  input:invalid {
    /* background-color: red; */
    outline: 2px solid red;
    box-shadow: 0 0 5px red;
  }
  input:valid {
    background-color: white;
  }

  /* div {
    margin: 20px;
  } */
`;

export default RecipeForm;
