import React, { useState } from "react";
import Wrapper from "./Wrapper";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "./actions";

const SignIn = () => {
  //SIGN IN STATE//
  const user = useSelector((state) => state.user);
  // console.log("signIn user", user);
  //SIGN IN FIELDS
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const dispatch = useDispatch();
  //SUBMIT - SIGN IN
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
      <form>
        {/* EMAIL */}
        <div>
          <label for="email">Email:</label>
          <input
            type="email"
            placeholder="ex. steamedhams@auroraborealis.org"
            name="email"
            required
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
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="button" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SignIn;
