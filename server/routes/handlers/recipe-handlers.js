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
  const allRecipes = await Recipe.find();
  console.log("all", allRecipes);
  if (allRecipes) {
    res.status(200).json({ status: 200, data: allRecipes });
  } else {
    res.status(404).json({ status: 404, message: "Error" });
  }

  //local fetch
  // if (recipes) {
  //   res.status(200).json({ status: 200, data: recipes });
  // } else {
  //   res.status(404).json({ status: 404, message: "Error" });
  // }
};

const getOneRecipe = async (req, res) => {
  // const findRecipe = recipes.find((recipe) => {
  //   if (Number(recipe._id) === Number(req.params._id)) {
  //     return recipe;
  //   }
  // });
  const findOneRecipe = await Recipe.findOne({ _id: req.params._id });
  if (findOneRecipe) {
    res.status(200).json({ status: 200, data: findOneRecipe });
  }
  res.status(400).json({ status: 400, message: "no recipe found" });
};

const createRecipe = (req, res) => {
  console.log("req", req.body);
  // console.log("image", req.body.recipeImage);
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
    recipeImage: req.body.recipeImage,
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
