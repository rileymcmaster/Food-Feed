import React, { useState } from "react";
import Wrapper from "./Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "./actions";
import styled from "styled-components";

const SignIn = () => {
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
        dispatch(signIn(data.data));
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
`;

export default SignIn;
