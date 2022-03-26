import { combineReducers } from "redux";

import user from "./signin-reducer";
import recipe from "./current-recipe-reducer";

export default combineReducers({ user, recipe });
