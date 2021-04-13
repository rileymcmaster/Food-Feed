import React, { useState } from "react";
import Wrapper from "./Wrapper";

const SignUp = () => {
  //states all for the form
  const [userInput, setUserInput] = useState({});
  //pop up window to redirect to sign in page
  const [successMessasge, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  //should make spaces impossible in handle

  //SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/user/signup", {
      method: "POST",
      // body: JSON.stringify({ handle, userName, email, password }),
      body: JSON.stringify(userInput),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ status, message, data }) => {
        if (status === 400) {
          console.log("bad", status, message);
          setErrorMessage(message);
        } else {
          console.log("good", status, data);
          setSuccessMessage(true);
        }
      })
      .catch((err) => {
        console.log("ERROR", err.stack);
        //SETE AN ERROR MESSAGE
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
