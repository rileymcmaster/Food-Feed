import React, { useState } from "react";
import Wrapper from "./Wrapper";

const SignUp = () => {
  //states all for the form
  const [userInput, setUserInput] = useState({});
  //TODO: pop up window to redirect to sign in page
  const [successMessasge, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  //should make spaces impossible in handle

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
      <form onSubmit={handleSubmit}>
        {/* handle */}
        <div>
          <label for="handle">handle:</label>
          <input
            type="text"
            placeholder="ex: SomeLikeItSpicy"
            name="handle"
            required
            onChange={(e) =>
              setUserInput({ ...userInput, handle: e.target.value })
            }
          />
        </div>
        {/* userName */}
        <div>
          <label for="userName">UserName:</label>
          <input
            type="text"
            placeholder="ex: Dave Davidson"
            name="userName"
            required
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
            required
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
            required
            onChange={(e) =>
              setUserInput({ ...userInput, password: e.target.value })
            }
          />
        </div>
        {/* UPLOAD AVATAR IMAGE */}
        <label for="upload-image">Upload avatar picture</label>
        <input
          type="file"
          name="upload-image"
          onChange={(e) => handleImageUpload(e)}
        ></input>
        <button
          type="button"
          onClick={() => {
            sendImage();
            setAvatarImage({});
          }}
        >
          Upload avatar
        </button>
        {imageUploading && <h1>image is uploading</h1>}
        {imageUploadComplete && <h1>Upload is complete!</h1>}
        {/* END UPLOAD IMG */}
        {/*  */}
        {/* SUBMIT BUTTON */}
        <div>
          <button type="submit" onClick="submit">
            Sign up
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SignUp;
