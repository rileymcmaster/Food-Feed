import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { signIn } from "./actions";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import GlobalStyles from "../GlobalStyles";
import GridPage from "./GridPage";
import RecipePage from "./RecipePage";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Header from "./Header";
import RecipeForm from "./CreateRecipeForm";
import UserPage from "./UserPage";
import ErrorPage from "./ErrorPage";

const App = () => {
  const dispatch = useDispatch();
  //KEEP USER SIGNED
  useEffect(() => {
    const localStorageId = JSON.parse(window.localStorage.getItem("_id"));
    if (localStorageId) {
      fetch(`/user/${localStorageId}`)
        .then((res) => res.json())
        .then((data) => {
          dispatch(signIn(data.data));
        });
    }
  }, []);

  return (
    <>
      <GlobalStyles />
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/recipes">
            <GridPage />
          </Route>
          <Route exact path="/recipe/create">
            <RecipeForm />
          </Route>
          <Route exact path="/recipe/:_id">
            <RecipePage />
          </Route>
          <Route exact path="/user/:_id">
            <UserPage />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/signin">
            <SignIn />
          </Route>
          <Route path="/">
            <ErrorPage />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
