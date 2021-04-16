const bcrypt = require("bcrypt");
require("dotenv").config();
let User = require("../../models/user");
const { MongoClient, ObjectID } = require("mongodb");
const { find } = require("../../models/user");

const saltRounds = 10;

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
////////////////
//create account//
////////////////
const createUserAccount = async (req, res) => {
  //check if email or handle already exist
  const foundUserEmail = await User.findOne({ email: req.body.email });
  const foundUserHandle = await User.findOne({ handle: req.body.handle });

  if (foundUserEmail) {
    //don't allow duplicate email
    res.status(400).json({ status: 400, message: "Email already exists" });
  } else if (foundUserHandle) {
    //don't allow duplicate handles
    res.status(400).json({ status: 400, message: "Handle already exists" });
  } else if (!foundUserEmail && !foundUserHandle) {
    //if user is unique then create away
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      User.create({
        userName: req.body.userName,
        handle: req.body.handle,
        email: req.body.email,
        isSignedIn: false,
        deactivated: false,
        password: hash,
        avatarUrl: req.body.avatarUrl,
        bio: req.body.bio,
      })
        .then((data) => {
          if (data) {
            res.status(200).json({ status: 200, data: data });
          }
        })
        .catch((err) => {
          console.log("error", err);
          res.status(404).json({ status: 404, message: "Problem with server" });
        });
    });
  }
};
////////////////
//LOG IN////
//////////////
const userSignIn = (req, res) => {
  //search for user and login if they exist
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    // console.log("user", user);
    if (!user) {
      console.log("no user");
      res.redirect("/");
    } else {
      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
          res.status(200).json({ status: 200, data: user });
        } else {
          res.send("Incorrect password");
        }
      });
    }
  });
};

const userSignOut = async (req, res) => {
  const user = { _id: req.body.user._id };
  const signedIn = req.body.user.isSignedIn;
  const updateStatus = { $set: { isSignedIn: false } };
  try {
    if (signedIn) {
      const result = await User.updateOne(user, updateStatus);
      if (result) {
        console.log("user signed out");
        res.status(200).json({ status: 200, message: "User signed out" });
      }
    }
  } catch (error) {
    console.log("error userSignOut", error);
    res
      .status(400)
      .json({ status: 400, message: "There was a problem signing out" });
  }
};
const deleteUserAccount = (req, res) => {
  //todo
};

const getUserProfile = async (req, res) => {
  const findOneUser = await User.findOne({ _id: req.params._id });
  try {
    // console.log("findOne", findOneUser);
    if (findOneUser) {
      res.status(200).json({ status: 200, data: findOneUser });
    }
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ status: 400, message: "No user found" });
  }
};

const updateUserRecipes = async (req, res) => {
  const query = { _id: req.body.createdBy };
  const updateCreations = { $push: { recipesCreated: req.body._id } };
  try {
    const result = await User.updateOne(query, updateCreations);
    if (result) {
      console.log("update of user's recipesCreated successful");
      res.status(200).json({ status: 200, message: "User info updated" });
    }
  } catch (error) {
    console.log("error updateUserRecipes", error);
    res.status(400).json({ status: 400, message: "Update user info failed" });
  }
};

module.exports = {
  userSignIn,
  createUserAccount,
  userSignOut,
  deleteUserAccount,
  getUserProfile,
  updateUserRecipes,
};
