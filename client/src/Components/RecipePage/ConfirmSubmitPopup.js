import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

// components
import { editRecipe } from "../actions";
import ButtonUpload from "../Buttons/ButtonUpload";

const ConfirmSubmitPopup = ({ confirmSendRecipe, setConfirmSendRecipe }) => {
  const user = useSelector((state) => state.user);
  const currentRecipe = useSelector((state) => state.recipe);
  const dispatch = useDispatch();
  const history = useHistory();

  const [editedRecipeObject, setEditedRecipeObject] = useState(null);
  const [sendingRecipe, setSendingRecipe] = useState("");
  const [sendingRecipeComplete, setSendingRecipeComplete] = useState("");
  const [sendingRecipeError, setSendingRecipeError] = useState("");

  const updateTitle = (e) => {
    const currentRecipeCopy = { ...currentRecipe };
    currentRecipeCopy.recipeName = e.target.value;
    dispatch(editRecipe(currentRecipeCopy));
  };

  const handleSubmitChanges = () => {
    setSendingRecipe("sending");
    const currentRecipeCopy = {
      ...currentRecipe,
      createdBy: user._id,
      isOriginal: false,
      date: "",
    };
    //keep the link to original recipe
    if (currentRecipe.isOriginal) {
      currentRecipeCopy.originalRecipe = currentRecipe._id;
    }
    fetch(`https://food-feed.herokuapp.com/recipes/create/edit`, {
      method: "POST",
      body: JSON.stringify(currentRecipeCopy),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ status, data }) => {
        if (status === 200) {
          setEditedRecipeObject(data);
          setSendingRecipe("");
          setSendingRecipeComplete("Recipe created!");
          setConfirmSendRecipe(false);
        } else {
          setSendingRecipe("");
          setSendingRecipeError("Error, try again");
        }
      })
      .catch((err) => {
        console.log("Error uploading recipe", err);
        setSendingRecipe("");
        setSendingRecipeError("Error, try again");
      });
  };
  useEffect(() => {
    if (editedRecipeObject) {
      // UPDATE USER'S RECIPES ARRAY
      fetch(`https://food-feed.herokuapp.com/user/edit/recipe`, {
        method: "PATCH",
        body: JSON.stringify(editedRecipeObject),
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
      })
        .then(() => history.push(`/recipe/${editedRecipeObject._id}`))
        .catch((err) => console.log("User's recipe array not updated", err));
    }
  }, [editedRecipeObject, history]);

  return (
    <ConfirmSendRecipe>
      <ConfirmCard>
        {/* recipe name */}
        <h1>Name your creation:</h1>
        <textarea
          autoFocus
          onFocus={(e) => e.currentTarget.select()}
          rows="2"
          value={currentRecipe.recipeName}
          onChange={(e) => updateTitle(e)}
        ></textarea>
        {/* send button */}
        <ConfirmButtonContainer>
          <ButtonUpload
            className="submit"
            onClick={() => {
              handleSubmitChanges();
            }}
            wait={sendingRecipe}
            fail={sendingRecipeError}
            success={sendingRecipeComplete}
          >
            <h1> SUBMIT</h1>
          </ButtonUpload>
        </ConfirmButtonContainer>
        {/* CANCEL button */}
        <ConfirmButtonContainer>
          <ButtonUpload onClick={() => setConfirmSendRecipe(false)}>
            cancel
          </ButtonUpload>
        </ConfirmButtonContainer>
      </ConfirmCard>
    </ConfirmSendRecipe>
  );
};

const ConfirmButtonContainer = styled.div`
  margin: auto;
  display: block;
  max-width: 200px;
  .input {
    font-size: 3rem;
  }
  h1 {
    font-size: 2rem;
  }
`;

const ConfirmCard = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: var(--recipe-box-shadow);
  background-color: rgba(255, 255, 255, 0.5);
  max-width: 600px;
  margin: auto;
  gap: 2rem;
  textarea {
    resize: none;
    text-align: center;
    vertical-align: center;
  }
`;
const ConfirmSendRecipe = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 999999999999999999;
`;

export default ConfirmSubmitPopup;
