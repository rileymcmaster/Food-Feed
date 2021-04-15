import React, { useState } from "react";
import Wrapper from "./Wrapper";
import styled from "styled-components";

const SignUp = () => {
  //states all for the form
  const [userInput, setUserInput] = useState({});
  // todo
  const [successMessasge, setSuccessMessage] = useState(false);
  // todo
  const [errorMessage, setErrorMessage] = useState(null);

  //DISABLE THE SUBMIT BUTTON UNTIL THE FORM IS FILLLED OUT
  let disableSubmit = true;
  if (userInput.handle && userInput.email && userInput.password) {
    disableSubmit = false;
  }

  //UPLOAD IMAGE
  const [avatarImage, setAvatarImage] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadComplete, setImageUploadComplete] = useState(false);
  const handleImageUpload = (ev) => {
    const file = ev.target.files[0];
    setAvatarImage(file);
  };

  const sendImage = (ev) => {
    setImageUploading(true);
    const data = new FormData();
    data.append("file", avatarImage);
    data.append("upload_preset", "feed-preset");
    data.append("cloud_name", "bodyofwater");
    fetch("https://api.cloudinary.com/v1_1/bodyofwater/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("image upload successful");
        setUserInput({ ...userInput, avatarUrl: data.url });
        setImageUploading(false);
        setImageUploadComplete(true);
      })
      .catch((err) => {
        console.log("error uploading", err);
      });
  };

  //SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/user/signup", {
      method: "POST",
      body: JSON.stringify(userInput),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ status, message, data }) => {
        if (status === 400) {
          console.log("signup didn't work", status, message);
          setErrorMessage(message);
        } else {
          console.log("signup was successful", status, data);
          setSuccessMessage(true);
        }
      })
      .catch((err) => {
        console.log("ERROR", err.stack);
        //SET AN ERROR MESSAGE
      });
  };
  return (
    <Wrapper>
      <Container>
        <form onSubmit={handleSubmit}>
          {/* handle */}
          <div>
            <label for="handle">User handle:</label>
            <input
              type="text"
              placeholder="One word, no special characters"
              name="handle"
              pattern="[A-Za-z0-9]+"
              onChange={(e) =>
                setUserInput({ ...userInput, userName: e.target.value })
              }
            />
          </div>
          {/* userName */}
          <div>
            <label for="userName">Display Name:</label>
            <input
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
            <label for="email">Email:</label>
            <input
              type="email"
              placeholder="ex. steamedhams@auroraborealis.org"
              name="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </div>
          <div>
            {/* PASSWORD */}
            <label for="password">Password:</label>
            <input
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
            <label for="upload-image">Upload avatar picture</label>
            <input
              type="file"
              name="upload-image"
              onChange={(e) => handleImageUpload(e)}
            ></input>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                sendImage();
                setAvatarImage({});
              }}
            >
              Upload avatar
            </button>
          </div>
          {imageUploading ? (
            <h1>image is uploading</h1>
          ) : imageUploadComplete ? (
            <h1>Upload is complete!</h1>
          ) : (
            <></>
          )}
          {/* END UPLOAD IMG */}

          {/* BIO */}
          <div>
            <label for="bio">Brief bio:</label>
            <textarea
              type="text"
              placeholder="I like spicy food"
              name="userName"
              onChange={(e) =>
                setUserInput({ ...userInput, bio: e.target.value })
              }
            ></textarea>
          </div>
          {/* SUBMIT BUTTON */}
          <div>
            <button type="submit" onClick="submit" disabled={!disableSubmit}>
              Sign up
            </button>
          </div>
        </form>
      </Container>
    </Wrapper>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
`;
export default SignUp;
