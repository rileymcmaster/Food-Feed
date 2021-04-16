const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
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
  // CONNECT TO SERVER
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  //check if email or handle already exist
  const foundUserEmail = await User.findOne({ email: req.body.email });
  const foundUserHandle = await User.findOne({ handle: req.body.handle });

  if (foundUserEmail) {
    console.log("duplicate");
    //don't allow duplicate email
    res.status(400).json({ status: 400, message: "Email already exists" });
  } else if (foundUserHandle) {
    console.log("duplicate");
    //don't allow duplicate handles
    res.status(400).json({ status: 400, message: "Handle already exists" });
  } else if (!foundUserEmail && !foundUserHandle) {
    console.log("user is unique");
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
        .catch((error) => {
          console.log("error", err, error);
          res.status(404).json({ status: 404, message: "Problem with server" });
        });
    });
  }
  // mongoose.disconnect();
  console.log("disconnected from server");
};
////////////////
//LOG IN////
//////////////
const userSignIn = async (req, res) => {
  // CONNECT TO SERVER
  await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  const userEmail = { email: req.body.email };
  try {
    const findUser = await User.findOne(userEmail);
    if (!findUser) {
      console.log("No user found");
      res.status(404).json({ status: 404, message: "No user found" });
    } else if (findUser.deactivated) {
      console.log("user has been deactivated");
      res
        .status(400)
        .json({ status: 400, message: "User has been deactivated" });
    } else {
      bcrypt.compare(req.body.password, findUser.password, (err, result) => {
        if (result) {
          res.status(200).json({ status: 200, data: findUser });
        } else {
          res.status(400).json({ status: 401, message: "Incorrect password" });
        }
        // mongoose.disconnect();
        console.log("disconnected from server");
      });
    }
  } catch (error) {
    console.log("error signing in", error);
    res.status(502).json({ status: 502, message: "Problem with server" });
    // mongoose.disconnect();
    console.log("disconnected from server");
  }
};

const userSignOut = async (req, res) => {
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
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
  // mongoose.disconnect();
  console.log("disconnected from server");
};
const deleteUserAccount = async (req, res) => {
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");

  // console.log("req.body", req.body);
  const user = { _id: req.body.user._id };
  const signedIn = { _id: req.body.isSignedIn };
  const deactiveAccount = { $set: { deactivated: true, recipesCreated: [] } };
  try {
    if (signedIn) {
      const result = await User.updateOne(user, deactiveAccount);
      if (result) {
        console.log("user deactivated");
        res
          .status(200)
          .json({ status: 200, message: "User has been deactivated" });
      }
    }
  } catch (error) {
    console.log("error deleteUserAccount");
    res
      .status(400)
      .json({ status: 400, message: "There was a problem deleting account" });
  }
  // mongoose.disconnect();
  console.log("disconnected from server");
};

const getUserProfile = async (req, res) => {
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
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
  // mongoose.disconnect();
  // console.log("disconnected from server");
};

const updateUserRecipes = async (req, res) => {
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
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
  // mongoose.disconnect();
  console.log("disconnected from server");
};

module.exports = {
  userSignIn,
  createUserAccount,
  userSignOut,
  deleteUserAccount,
  getUserProfile,
  updateUserRecipes,
};
