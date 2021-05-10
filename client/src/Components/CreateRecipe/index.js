import React, { useState } from "react";
import styled from "styled-components";
import { useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ButtonUpload from "../Buttons/ButtonUpload";
import { IoIosCloseCircle } from "react-icons/io";
import { BsPlusCircle } from "react-icons/bs";
import EachDirectionContainer from "./EachDirectionContainer";

const RecipeForm = () => {
  const history = useHistory();
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

  //toggle private setting
  const updatePrivate = () => {
    const userInputCopy = { ...userInput };
    userInputCopy.isPrivate = !userInputCopy.isPrivate;
    setUserInput(userInputCopy);
  };

  //IMAGE UPLOAD
  const [recipeImage, setRecipeImage] = useState(null);
  const [imageUploading, setImageUploading] = useState("");
  const [imageUploadComplete, setImageUploadComplete] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const sendImage = (ev) => {
    if (!recipeImage) {
      return setImageUploadError("No image");
    }
    setImageUploadError("");
    setImageUploading("uploading");
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
        setUserInput({ ...userInput, recipeImageUrl: data.url });
        setImageUploading("");
        setImageUploadComplete("Upload complete!");
      })
      .catch((err) => {
        console.log("error", err);
        setImageUploading("");
        setImageUploadError("Error uploading image");
      });
  };
  //
  //SUBMIT
  const [sendingRecipe, setSendingRecipe] = useState("");
  const [recipeSuccess, setRecipeSuccess] = useState("");
  const [recipeFail, setRecipeFail] = useState("");
  const handleSubmit = (e) => {
    setSendingRecipe("upload in progress");
    e.preventDefault();
    fetch("https://food-feed.herokuapp.com/recipes/create", {
      method: "POST",
      body: JSON.stringify(userInput),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ status, data }) => {
        if (status === 200) {
          setSendingRecipe("");
          setRecipeSuccess("Recipe created!");
          //delay to redirect to the feed page
          setTimeout(() => {
            history.push("/recipes");
          }, 2000);
        } else {
          console.log("problem uploading recipe");
          setSendingRecipe("");
          setRecipeFail("Error, try again");
        }
      })
      .catch((err) => {
        console.log("Error", err);
        setRecipeFail("Error, try again");
      });
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

  // REMOVE DIRECTION
  const handleRemoveDirection = (directionIndex) => {
    // make a copy of the form
    const userInputCopy = { ...userInput };
    // there must be at least one direction
    if (userInputCopy.directions.length > 1) {
      const remove = userInputCopy.directions.splice(directionIndex, 1);
      setUserInput(userInputCopy);
    }
  };
  // RENDERED ON THE PAGE
  return !user.isSignedIn ? (
    <FormContainer>
      <Link style={{ marginTop: "50vh" }} to={"/signin"}>
        <h1>please log in</h1>
      </Link>
    </FormContainer>
  ) : (
    <FormContainer>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Title>
          <h1>Create a new recipe</h1>
        </Title>
        {/* RECIPE NAME */}
        <NameCard>
          <h1>
            <label for="recipeName">Recipe name:</label>
          </h1>
          <input
            className="recipe-name"
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
        </NameCard>
        {/* INGREDIENTS */}
        <IngredientsCard>
          <h1>INGREDIENTS:</h1>
          {/* {numIngredientsArray.map((num, index) => { */}
          {userInput.ingredients.map((ingredient, index) => {
            return (
              <IngredientLine>
                {/* <label for={`ingredient-${index}`}>Ingredient {index + 1}:</label> */}
                <input
                  type="text"
                  placeholder={`Ingredient ${index + 1}`}
                  name={`ingredient`}
                  value={userInput.ingredients[index].ingredient}
                  onChange={(e) => updateIngredients(e, index)}
                />
                <button
                  className="remove-button"
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  <IoIosCloseCircle size={30} />
                </button>
              </IngredientLine>
            );
          })}
        </IngredientsCard>
        {/* MORE INGREDIENTS */}
        <button
          className="add-button"
          type="button"
          onClick={() => handleAddIngredient()}
        >
          <BsPlusCircle size={35} />
        </button>
        {/* END INGREDIENTS */}
        {/*  */}
        {/* DIRECTIONS */}
        <DirectionCard>
          <h1>DIRECTIONS:</h1>
          {userInput.directions.map((direction, index) => {
            return (
              <>
                <EachDirectionContainer
                  key={"direction-" + index}
                  direction={direction}
                  ingredients={userInput.ingredients}
                  index={index}
                  value={userInput.directions[index].direction}
                  directionChange={(e) => updateDirections(e, index)}
                  clickFunction={() => handleRemoveDirection(index)}
                  ingredientChange={(e) => {
                    updateDirectionsIngredients(e, index);
                  }}
                />
              </>
            );
          })}
        </DirectionCard>
        {/* ADD DIRECTIONS BUTTON */}
        <button
          className="add-button"
          type="button"
          onClick={() => {
            handleAddDirection();
          }}
        >
          <BsPlusCircle size={35} />
        </button>
        {/* END DIRECTIONS */}
        {/* PRIVATE CHECKBOX */}
        <PrivateLine>
          <label for="isPrivate">
            <input
              className="checkbox"
              type="checkbox"
              name="isPrivate"
              value="isPrivate"
              onChange={updatePrivate}
            />
            Private (only you will be able to see this recipe)
          </label>
        </PrivateLine>
        {/* UPLOAD IMAGE */}
        <label for="uploadImage" className="file-uploader">
          <input
            className="file-uploader"
            type="file"
            name="uploadImage"
            id="uploadImage"
            onChange={(e) => {
              const file = e.target.files[0];
              setRecipeImage(file);
              setImageUploading("");
              setImageUploadComplete("");
              setImageUploadError("");
            }}
          />
          <UploadImageBtn>
            <div>Choose image</div>
            {recipeImage && <p>{recipeImage.name}</p>}
          </UploadImageBtn>
        </label>
        <ButtonContainer style={{ width: "100px" }}>
          <ButtonUpload
            onClick={() => {
              sendImage();
            }}
            wait={imageUploading}
            success={imageUploadComplete}
            fail={imageUploadError}
          >
            Upload image
          </ButtonUpload>
        </ButtonContainer>
        {/* END UPLOAD IMAGE */}
        <ButtonContainer>
          {/* SUBMIT */}
          <ButtonUpload
            wait={sendingRecipe}
            success={recipeSuccess}
            fail={recipeFail}
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </ButtonUpload>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};
// WHOLE PAGE
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  padding: 20px;
  margin: 0 auto;
  align-items: center;
  text-align: center;
  label {
    margin-bottom: 0.5rem;
  }
  form {
    border: none;
    width: 100%;
  }
  input.recipe-name {
    min-width: 220px;
  }
  input.file-uploader {
    width: 50%;
  }
  input,
  textarea {
    border: none;
    padding: 5px;
    font-size: 1.2rem;
    text-align: start;
    outline: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    vertical-align: center;
  }
  input[type="file"] {
    display: none;
  }
  input.checkbox {
    box-shadow: none;
  }
  textarea {
    resize: none;
  }
  input:focus-within {
    outline: 2px solid blue;
    box-shadow: 0 0 3px inset blue;
  }
  input:invalid {
    outline: 2px solid red;
    box-shadow: 0 0 5px red;
  }
  input:valid {
    background-color: white;
  }
  & button.add-button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
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
    background-color: transparent;
    border: none;
    width: 30px;
    height: 30px;
    :hover,
    :focus {
      outline: none;
      color: red;
    }
  }
`;
// PAGE TITLE
const Title = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 2rem;
  h1 {
    font-size: 2rem;
    margin: 2rem;
    padding: 10px;
    box-shadow: var(--recipe-box-shadow);
  }
`;
// RECIPE NAME
const NameCard = styled.div`
  h1 {
    margin-bottom: 10px;
  }
`;
// INGREDIENTS
const IngredientsCard = styled.div`
  max-width: 700px;
  margin: 30px auto 0;
  & h1 {
    margin-bottom: 10px;
  }
`;
const IngredientLine = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  & input {
    width: 90%;
    margin-bottom: 2px;
  }
`;

// DIRECTIONS
const DirectionCard = styled.div`
  transition: all 2s ease;
  max-width: 700px;
  margin: 30px auto 0;
  & h1 {
    margin-bottom: 10px;
  }
`;

const PrivateLine = styled.div`
  margin: 40px auto;
`;
const UploadImageBtn = styled.div`
  & div {
    font-size: 1.1rem;
    margin: 0 auto 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dotted var(--primary-color);
    width: 100px;
    height: 50px;
    &:hover,
    &:focus {
      background-color: var(--primary-color);
      color: white;
    }
    &:active {
      box-shadow: 0 0 5px inset rgba(0, 0, 0, 0.8);
    }
  }
  & p {
    font-size: 0.8rem;
  }
`;
const ButtonContainer = styled.div`
  max-width: 200px;
  margin: 40px auto;
  & h1 {
    font-size: 1.5rem;
  }
`;

export default RecipeForm;
