const bcrypt = require("bcrypt");
require("dotenv").config();
let User = require("../../models/user");

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
    console.log("user", user);
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

const userSignOut = (req, res) => {
  //todo
};

const deleteUserAccount = (req, res) => {
  //todo
};

const getUserProfile = (req, res) => {
  //to do
};

module.exports = {
  userSignIn,
  createUserAccount,
  userSignOut,
  deleteUserAccount,
  getUserProfile,
};
