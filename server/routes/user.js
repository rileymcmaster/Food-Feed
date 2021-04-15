const express = require("express");
const {
  getUserProfile,
  userSignIn,
  createUserAccount,
  userSignOut,
  deleteUserAccount,
  updateUserRecipes,
} = require("./handlers/user-handlers");
const router = express.Router();

//get one user
router.get("/:_id", getUserProfile);

//create account
router.post("/signup", createUserAccount);
//sign in
router.post("/signin", userSignIn);

//update user's recipes when edits made
router.patch("/edit/recipe", updateUserRecipes);

module.exports = router;
