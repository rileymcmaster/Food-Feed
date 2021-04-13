import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import GlobalStyles from "../GlobalStyles";
import GridPage from "./GridPage";
import RecipePage from "./RecipePage";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Header from "./Header";
import RecipeForm from "./RecipeForm";

const App = () => {
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
          <Route path="/recipe/:_id">
            <RecipePage />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/signin">
            <SignIn />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
