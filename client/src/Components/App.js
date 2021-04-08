import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import GlobalStyles from "../GlobalStyles";
import GridPage from "./GridPage";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/recipes">
            <GridPage />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
