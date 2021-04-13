const express = require("express");
const {
  getUserProfile,
  userSignIn,
  createUserAccount,
  userSignOut,
  deleteUserAccount,
} = require("./handlers/user-handlers");
const router = express.Router();

//get one user
router.get("/", getUserProfile);

//create account
router.post("/signup", createUserAccount);
//sign in
router.post("/signin", userSignIn);

module.exports = router;
