//import database
const { recipes } = require("../../data/recipes");
const Recipe = require("../../models/recipe");
const assert = require("assert");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getAllRecipes = async (req, res) => {
  // console.log("REQ", req.params);
  // CONNECT TO SERVER
  console.log("req true", req.params);
  // const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  try {
    // FILTER for privacy settings
    const notPrivateRecipes = await Recipe.find({ isPrivate: false });
    let userPrivateRecipes = [];
    if (req.params._id !== "0") {
      console.log("there is a param", req.params);
      userPrivateRecipes = await Recipe.find({
        isPrivate: true,
        createdBy: req.params._id,
      });
    }
    if (notPrivateRecipes || userPrivateRecipes) {
      const allResults = [...notPrivateRecipes, ...userPrivateRecipes];
      const sortedResults = allResults.sort((a, b) => b.date - a.date);
      res.status(200).json({
        status: 200,
        data: sortedResults,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ status: 404, message: "Error" });
  }
  // await mongoose.connection.close();
  console.log("disconnected from server");
};

const getOneRecipe = async (req, res) => {
  // console.log("req params", req.params);
  // CONNECT TO SERVER
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  try {
    const findOneRecipe = await Recipe.findOne({ _id: req.params._id });
    if (findOneRecipe) {
      res.status(200).json({ status: 200, data: findOneRecipe });
    }
  } catch (error) {
    console.log("error get one recipe", error);
    res.status(400).json({ status: 400, message: "no recipe found" });
  }
  // await mongoose.disconnect();
  console.log("disconnected from server");
};

const createRecipe = async (req, res) => {
  // CONNECT TO SERVER
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  // send to mongo
  Recipe.create({
    recipeName: req.body.recipeName,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    isOriginal: true,
    createdBy: req.body.createdBy,
    variations: [],
    isPrivate: req.body.isPrivate,
    recipeImageUrl: req.body.recipeImageUrl,
    originalRecipe: "",
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
  // mongoose.disconnect();
  // console.log("disconnected from server");
};

const editRecipe = async (req, res) => {
  // CONNECT TO SERVER
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  //send to mongo
  Recipe.create({
    recipeName: req.body.recipeName,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    isOriginal: false,
    originalRecipe: req.body.originalRecipe,
    createdBy: req.body.createdBy,
    variations: [],
    isPrivate: req.body.isPrivate,
    recipeImageUrl: req.body.recipeImageUrl,
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
  // mongoose.disconnect();
  // console.log("disconnected from server");
};

const updateRecipeVariation = async (req, res) => {
  // CONNECT TO SERVER
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  //update requires two parameters, _id to match and the value that is changing
  const query = { _id: req.body._id };
  const updateVariations = { $set: { variations: req.body.variations } };
  try {
    const updateRecipeResult = await Recipe.updateOne(query, updateVariations);
    if (updateRecipeResult) {
      console.log("update of variations successful");
      res.status(200).json({
        status: 200,
        message: `${req.body.recipeName} has been updated`,
      });
    }
  } catch (error) {
    console.log("error get one recipe", error);
    res.status(400).json({ status: 400, message: "no recipe found" });
  }
  // mongoose.disconnect();
  // console.log("disconnected from server");
};

const deleteRecipe = async (req, res) => {};

const likeRecipe = async (req, res) => {
  // CONNECT TO SERVER
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  //todo
  // mongoose.disconnect();
  // console.log("disconnected from server");
};
//USER PAGE
const getMultipleRecipes = async (req, res) => {
  // CONNECT TO SERVER
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  try {
    const findRecipes = await Recipe.find({ createdBy: req.params._id });
    // console.log("all", allRecipes);
    if (findRecipes) {
      res.status(200).json({ status: 200, data: findRecipes });
    }
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ status: 404, message: "Error" });
  }
  // mongoose.disconnect();
  // console.log("disconnected from server");
};

//deactive user account deletes their recipes.
//find recipes created by the userId and delete them
const deleteRecipeByUserId = async (req, res) => {
  // CONNECT TO SERVER
  const client = await mongoose.connect(MONGO_URI, options);
  console.log("connected to server");
  try {
    const result = await Recipe.deleteMany({ createdBy: req.params._id });
    if (result) {
      res.status(200).json({ status: 200, data: result });
    }
  } catch (error) {
    console.log("error deleting recipes by userId", error);
    res.status(400).json({ status: 400, message: "Error deleting recipes" });
  }
  // mongoose.disconnect();
  // console.log("disconnected from server");
};

module.exports = {
  getAllRecipes,
  getOneRecipe,
  editRecipe,
  deleteRecipe,
  likeRecipe,
  createRecipe,
  updateRecipeVariation,
  getMultipleRecipes,
  deleteRecipeByUserId,
};
