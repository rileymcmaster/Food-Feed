import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Wrapper from "./Wrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  Image,
  Video,
  Transformation,
  CloudinaryContext,
} from "cloudinary-react";

const RecipeForm = () => {
  //should only be able to submit recipe if signed in!!
  //USER STATE
  const user = useSelector((state) => state.user);

  //the recipe state that will be submitted
  const [userInput, setUserInput] = useState({
    recipeName: "",
    ingredients: [],
    directions: [],
    isPrivate: false,
    createdBy: user._id,
    recipeImageUrl: "",
  });
  // console.log("user input", userInput);

  //number of inputs for Ingredients & Directions
  const [numIngredients, setNumIngredients] = useState(1);
  const [numDirections, setNumDirections] = useState(1);
  //
  //GENERATE THE NUMBER OF INGREDIENT & DIRECTION INPUTS
  const range = (start, end, step = 1) => {
    const length = Math.floor(Math.abs((end - start) / step)) + 1;
    return Array.from(Array(length), (x, index) => start + index * step);
  };
  const numIngredientsArray = range(1, numIngredients);
  const numDirectionsArray = range(1, numDirections);

  //BUTTONS FOR **INGREDIENTS**
  //handle PLUS ingredients button
  const increaseNumIngredients = () => {
    setNumIngredients(numIngredients + 1);
  };
  //handle MINUS ingredients button
  const decreaseNumIngredients = () => {
    if (numIngredients > 1) {
      setNumIngredients(numIngredients - 1);
    } else {
      return;
    }
  };
  //BUTTONS FOR **DIRECTIONS**
  //handle PLUS directions button
  const increaseNumDirections = () => {
    setNumDirections(numDirections + 1);
  };
  //handle MINUS directions button
  const decreaseNumDirections = () => {
    if (numDirections > 1) {
      setNumDirections(numDirections - 1);
    } else {
      return;
    }
  };
  // INGREDIENTS INPUT creates array and updates the userInput
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
    //currently does not handle unchecking the box
    const userInputCopy = { ...userInput };
    userInputCopy.directions[directionIndex].ingredients = [
      ...userInputCopy.directions[directionIndex].ingredients,
      { ingredient: e.target.value },
    ];
    setUserInput(userInputCopy);
  };
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
  //SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    //THIS WORKS VVVV except for the image
    fetch("/recipes/create", {
      method: "POST",
      body: JSON.stringify(userInput),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });
    //WORKS GOOOD /\ /\ /\
  };

  return (
    <Wrapper>
      <FormContainer>
        <form onSubmit={handleSubmit} enctype="multipart/form-data">
          {/* RECIPE NAME */}
          <div>
            <label for="recipeName">Recipe name:</label>
            <input
              type="text"
              placeholder="Name of dish"
              name="recipeName"
              required
              onChange={(e) =>
                setUserInput({ ...userInput, recipeName: e.target.value })
              }
            />
          </div>
          {/* INGREDIENTS */}
          <h1>INGREDIENTS:</h1>
          {numIngredientsArray.map((num, index) => {
            return (
              <div>
                <label for={`ingredient`}>Ingredient {num}:</label>
                <input
                  type="text"
                  placeholder="ingredient"
                  name={`ingredient`}
                  onChange={(e) => updateIngredients(e, index)}
                />
              </div>
            );
          })}
          {/* MORE INGREDIENTS */}
          <button type="button" onClick={increaseNumIngredients}>
            +
          </button>
          {/* FEWER INGREDIENTS */}
          <button type="button" onClick={decreaseNumIngredients}>
            -
          </button>
          {/* END INGREDIENTS */}
          {/* DIRECTIONS */}
          <h1>DIRECTIONS:</h1>
          {numDirectionsArray.map((num, index) => {
            return (
              <div>
                <label for={`direction`}>Step {num}:</label>
                <input
                  type="text"
                  placeholder="what to do"
                  name={`direction`}
                  onChange={(e) => updateDirections(e, index)}
                />
                {/* INGREDIENT CHECKBOXES */}
                {userInput.ingredients.map((ingredient, idx) => {
                  return (
                    <div>
                      <label for={`${num}-${ingredient.ingredient}`}>
                        <input
                          type="checkbox"
                          name="ingredient"
                          class={index}
                          value={ingredient.ingredient}
                          // value={ingredient.ingredient}
                          id={`${num}-${ingredient.ingredient}`}
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
          <button type="button" onClick={increaseNumDirections}>
            +
          </button>
          {/* FEWER DIRECTIONS */}
          <button type="button" onClick={decreaseNumDirections}>
            -
          </button>
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

const FormContainer = styled.div`
  div {
    margin: 20px;
  }
`;

export default RecipeForm;
