import React, { useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import ButtonUpload from "./Buttons/ButtonUpload";

const SignUp = () => {
  //states all for the form
  const [userInput, setUserInput] = useState({
    handle: "",
    userName: "",
    email: "",
    password: "",
    avatarUrl: "",
  });

  const [waitingMessage, setWaitingMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  //DISABLE THE SUBMIT BUTTON UNTIL THE FORM IS FILLLED OUT
  let disableSubmit = true;
  if (
    userInput.handle &&
    userInput.email &&
    userInput.password &&
    userInput.avatarUrl
  ) {
    disableSubmit = false;
  }

  //UPLOAD IMAGE
  const [avatarImage, setAvatarImage] = useState();
  const [imageUploading, setImageUploading] = useState("");
  const [imageUploadComplete, setImageUploadComplete] = useState("");
  const [imageUploadFailed, setImageUploadFailed] = useState("");
  const handleImageUpload = (ev) => {
    const file = ev.target.files[0];
    setAvatarImage(file);
  };

  const sendImage = (ev) => {
    if (!avatarImage) {
      return setImageUploadFailed("No image");
    }
    setImageUploadFailed("");
    setImageUploading("Upload in progress");
    const data = new FormData();
    data.append("file", avatarImage);
    data.append("upload_preset", "food-feed-avatar");
    data.append("cloud_name", "bodyofwater");
    fetch("https://api.cloudinary.com/v1_1/bodyofwater/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUserInput({ ...userInput, avatarUrl: data.url });
        setImageUploading("");
        setImageUploadComplete("Upload complete");
      })
      .catch((err) => {
        setImageUploading("");
        setImageUploadFailed("Upload failed");
        console.log("error uploading", err);
      });
  };

  //SUBMIT
  const handleSubmit = (e) => {
    // e.preventDefault();
    setWaitingMessage("waiting");
    fetch("https://food-feed.herokuapp.com/user/signup", {
      method: "POST",
      body: JSON.stringify(userInput),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ status, message }) => {
        if (status === 200) {
          setWaitingMessage("");
          setSuccessMessage("Success!");
          const pushToSignin = setTimeout(() => {
            history.push("/signin");
          }, 1000);
          return () => clearTimeout(pushToSignin);
        } else {
          setWaitingMessage("");
          console.log("signup didn't work", status, message);
          setErrorMessage(message);
        }
      })
      .catch((err) => {
        setWaitingMessage("");
        console.log("ERROR", err.stack);
        setErrorMessage("Error, try again");
      });
  };
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {/* handle */}
        <div>
          <label htmlFor="handle">User handle:</label>
          <input
            size="40"
            tabIndex="2"
            type="text"
            placeholder="One word, no special characters"
            name="handle"
            autoFocus
            pattern="[A-Za-z0-9]+"
            onChange={(e) =>
              setUserInput({
                ...userInput,
                handle: e.target.value.toLowerCase(),
              })
            }
          />
          {errorMessage === "Handle already exists" && (
            <ErrorMessage>Handle already exists</ErrorMessage>
          )}
        </div>
        {/* userName */}
        <div>
          <label htmlFor="userName">Display Name:</label>
          <input
            size="40"
            type="text"
            placeholder="ex: Dave Davidson"
            name="userName"
            onChange={(e) =>
              setUserInput({ ...userInput, userName: e.target.value })
            }
          />
        </div>
        {/* EMAIL */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            size="40"
            type="email"
            placeholder="ex. steamedhams@auroraborealis.org"
            name="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            onChange={(e) =>
              setUserInput({ ...userInput, email: e.target.value })
            }
          />
          {errorMessage === "Email already exists" && (
            <ErrorMessage>This email already has an account</ErrorMessage>
          )}
        </div>
        <div>
          {/* PASSWORD */}
          <label htmlFor="password">Password:</label>
          <input
            size="40"
            type="password"
            placeholder="Enter password"
            name="password"
            onChange={(e) =>
              setUserInput({ ...userInput, password: e.target.value })
            }
          />
        </div>
        {/* UPLOAD AVATAR IMAGE */}
        <div>
          <label htmlFor="uploadImage">
            <input
              type="file"
              name="uploadImage"
              id="uploadImage"
              onChange={(e) => {
                setImageUploading("");
                setImageUploadComplete("");
                setImageUploadFailed("");
                handleImageUpload(e);
              }}
            />
            <UploadImageBtn>
              <div>Choose avatar</div>
              {avatarImage && <p>{avatarImage.name}</p>}
            </UploadImageBtn>
          </label>
        </div>
        <ButtonContainer style={{ marginTop: "-40px" }}>
          <ButtonUpload
            onClick={() => {
              sendImage();
              setAvatarImage({});
            }}
            wait={imageUploading}
            success={imageUploadComplete}
            fail={imageUploadFailed}
          >
            Upload avatar
          </ButtonUpload>
        </ButtonContainer>
        {/* END UPLOAD IMG */}

        {/* BIO */}
        <div>
          <label htmlFor="bio">Brief bio:</label>
          <textarea
            rows="4"
            cols="50"
            type="text"
            placeholder="I like spicy food"
            name="userName"
            onChange={(e) =>
              setUserInput({ ...userInput, bio: e.target.value })
            }
          ></textarea>
          {errorMessage === "problem with server" && (
            <ErrorMessage>There was an error, please try again</ErrorMessage>
          )}
        </div>
        {/* SUBMIT BUTTON */}
        <ButtonContainer>
          <ButtonUpload
            onClick={(e) => handleSubmit(e)}
            disabled={disableSubmit ? "disabled" : ""}
            wait={waitingMessage}
            success={successMessage}
            fail={errorMessage}
          >
            <h1>Sign up</h1>
          </ButtonUpload>
        </ButtonContainer>
      </form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  align-items: center;
  text-align: center;
  div {
    padding: 20px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  label {
    margin-bottom: 0.5rem;
  }
  form {
    border: none;
    width: 100%;
  }
  input,
  textarea {
    max-width: 80%;
    margin: 0 auto;
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
  input[type="file"] {
    display: none;
  }
  input:invalid {
    outline: 2px solid red;
    box-shadow: 0 0 5px red;
  }
  input:valid {
    background-color: white;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: red;
  margin-top: 20px;
  margin-bottom: 0;
  padding: 0;
`;
const ButtonContainer = styled.div`
  max-width: 200px;
  margin: 0 auto;
  & h1 {
    font-size: 1.5rem;
  }
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
export default SignUp;
