//import database
const { recipes } = require("../../data/recipes");
const Recipe = require("../../models/recipe");
const assert = require("assert");
const { MongoClient } = require("mongodb");
const fs = require("file-system");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();
const { MONGO_URI } = process.env;

const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    // console.log("all", allRecipes);
    if (allRecipes) {
      res.status(200).json({ status: 200, data: allRecipes });
    }
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ status: 404, message: "Error" });
  }
};

const getOneRecipe = async (req, res) => {
  try {
    const findOneRecipe = await Recipe.findOne({ _id: req.params._id });
    if (findOneRecipe) {
      res.status(200).json({ status: 200, data: findOneRecipe });
    }
  } catch (error) {
    console.log("error get one recipe", error);
    res.status(400).json({ status: 400, message: "no recipe found" });
  }
};

const createRecipe = (req, res) => {
  console.log("req", req.body);
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
};

const editRecipe = (req, res) => {
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
};

const updateRecipeVariation = async (req, res) => {
  console.log("req body", req.body);
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
};

const likeRecipe = (req, res) => {
  //todo
};

const getMultipleRecipes = async (req, res) => {
  // console.log("req params", req.params);
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
};

module.exports = {
  getAllRecipes,
  getOneRecipe,
  editRecipe,
  likeRecipe,
  createRecipe,
  updateRecipeVariation,
  getMultipleRecipes,
};
