import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "./actions";
import styled from "styled-components";
import ButtonUpload from "./Buttons/ButtonUpload";

const SignIn = () => {
  const history = useHistory();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [waitingMessage, setWaitingMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setWaitingMessage("waiting");
    fetch("https://food-feed.herokuapp.com/user/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ status, data, message }) => {
        if (status === 200) {
          window.localStorage.setItem("_id", JSON.stringify(data._id));
          dispatch(signIn(data));
          setWaitingMessage("");
          setSuccessMessage("Success!");
          //delay to redirect to the feed page
          setTimeout(() => {
            history.push("/recipes");
          }, 1000);
        } else {
          setWaitingMessage("");
          console.log("message", message);
          setErrorMessage(message);
        }
      })
      .catch((err) => {
        console.log("Error signing in", err);
      });
  };

  //RENDERED
  return (
    <Container>
      <form>
        {/* EMAIL */}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            onFocus={() => {
              setErrorMessage("");
              setWaitingMessage("");
            }}
            size="40"
            autoFocus
            type="email"
            placeholder="ex. steamedhams@auroraborealis.org"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          {/* PASSWORD */}
          <label htmlFor="password">Password:</label>
          <input
            onFocus={() => {
              setErrorMessage("");
              setWaitingMessage("");
            }}
            size="40"
            type="password"
            placeholder="Enter password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <ButtonContainer>
            <ButtonUpload
              onClick={handleSubmit}
              wait={waitingMessage}
              success={successMessage}
              fail={errorMessage}
            >
              <h1>Sign in</h1>
            </ButtonUpload>
          </ButtonContainer>
        </div>
      </form>
    </Container>
  );
};

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
    font-size: 1.7rem;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  text-align: center;

  div {
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  label {
    margin-bottom: 0.5rem;
  }
  form {
    width: 100%;
  }
  & input,
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
  & input:focus-within {
    outline: 2px solid blue;
  }
  & input:invalid {
    outline: 2px solid red;
    box-shadow: 0 0 5px red;
  }
  &input:valid {
    background-color: white;
  }
  & button {
    background-color: transparent;
    border: none;
    outline: none;
  }
`;

export default SignIn;
