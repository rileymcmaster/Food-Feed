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
    console.log("error", error);
    res.status(400).json({ status: 400, message: "no recipe found" });
  }
};

const createRecipe = (req, res) => {
  //UPLOAD IMAGE

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
  //todo
};

const likeRecipe = (req, res) => {
  //todo
};
module.exports = {
  getAllRecipes,
  getOneRecipe,
  editRecipe,
  likeRecipe,
  createRecipe,
};
