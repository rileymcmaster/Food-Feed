import React, { useState } from "react";
import Wrapper from "./Wrapper";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "./actions";
import styled from "styled-components";

const SignIn = () => {
  const history = useHistory();
  //SIGN IN STATE//
  const user = useSelector((state) => state.user);
  // console.log("signIn user", user);
  //SIGN IN FIELDS
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const dispatch = useDispatch();

  //SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/user/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        window.localStorage.setItem("_id", JSON.stringify(data.data._id));
        dispatch(signIn(data.data));
        history.push("/recipes");
      })
      .catch((err) => {
        console.log("ERROR", err);
        //SET AN ERROR MESSAGE
      });
  };

  //RENDERED
  return (
    <Wrapper>
      <Container>
        <h1>Sign in</h1>
        <form>
          {/* EMAIL */}
          <div>
            <label for="email">Email:</label>
            <input
              type="email"
              placeholder="ex. steamedhams@auroraborealis.org"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            {/* PASSWORD */}
            <label for="password">Password:</label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="button" onClick={handleSubmit}>
              Login
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
  & input,
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

  /* textarea {
    resize: none;
  } */
  & input:focus-within {
    outline: 2px solid blue;
  }

  & input:invalid {
    /* background-color: red; */
    outline: 2px solid red;
    box-shadow: 0 0 5px red;
  }
  &input:valid {
    background-color: white;
  }
`;

export default SignIn;
