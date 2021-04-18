const express = require("express");
const {
  getUserProfile,
  userSignIn,
  createUserAccount,
  userSignOut,
  deleteUserAccount,
  updateUserRecipes,
  UserRemoveOneRecipe,
} = require("./handlers/user-handlers");
const router = express.Router();

//get one user
router.get("/:_id", getUserProfile);

//create account
router.post("/signup", createUserAccount);
//sign in
router.post("/signin", userSignIn);

//sign out
router.patch("/signout", userSignOut);

//delete user
router.patch("/delete", deleteUserAccount);

//update user's recipes when edits made
router.patch("/edit/recipe", updateUserRecipes);

//remove recipe from user's recipes array
router.patch("/edit/remove", UserRemoveOneRecipe);

module.exports = router;
