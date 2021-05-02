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
// FETCH ALL
const getAllRecipes = async (req, res) => {
  try {
    // FILTER for privacy settings
    const notPrivateRecipes = await Recipe.find({
      isPrivate: false,
      isDeleted: false,
    });
    let userPrivateRecipes = [];
    if (req.params._id !== "0") {
      userPrivateRecipes = await Recipe.find({
        isPrivate: true,
        createdBy: req.params._id,
        isDeleted: false,
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
};

const getOneRecipe = async (req, res) => {
  try {
    const findOneRecipe = await Recipe.findOne({
      _id: req.params._id,
      isDeleted: false,
    });
    if (findOneRecipe) {
      res.status(200).json({ status: 200, data: findOneRecipe });
    }
  } catch (error) {
    console.log("error get one recipe", error);
    res.status(400).json({ status: 400, message: "no recipe found" });
  }
};
//
//
// CREATE
const createRecipe = async (req, res) => {
  // set default image
  let imageUrl;
  if (!req.body.recipeImageUrl) {
    imageUrl =
      "https://res.cloudinary.com/bodyofwater/image/upload/v1618879534/how-to-buy-a-used-car_xk5gof.jpg";
  } else {
    imageUrl = req.body.recipeImageUrl;
  }
  // send to mongo
  Recipe.create({
    recipeName: req.body.recipeName,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    isOriginal: true,
    createdBy: req.body.createdBy,
    variations: [],
    isPrivate: req.body.isPrivate,
    recipeImageUrl: imageUrl,
    originalRecipe: "",
    isDeleted: false,
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
//
//
// EDIT
const editRecipe = async (req, res) => {
  //send to mongo
  try {
    let createRecipe = await Recipe.create({
      recipeName: req.body.recipeName,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      isOriginal: false,
      isDeleted: false,
      originalRecipe: req.body.originalRecipe,
      createdBy: req.body.createdBy,
      variations: [],
      isPrivate: req.body.isPrivate,
      recipeImageUrl: req.body.recipeImageUrl,
    });
    if (createRecipe) {
      // UPDATE ORIGINAL RECIPE's VARIATIONS ARRAY
      let originalRecipe = { _id: req.body.originalRecipe };
      let updateVariations = {
        $push: {
          variations: {
            variationId: createRecipe._id,
            variationTitle: createRecipe.recipeName,
          },
        },
      };
      let updateOriginal = await Recipe.updateOne(
        originalRecipe,
        updateVariations
      );
      if (updateOriginal) {
        // return the newly created recipe
        res.status(200).json({ status: 200, data: createRecipe });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "There was an issue creating the recipe",
      });
    }
  } catch (error) {
    res.status(404).json({ status: 404, message: "Problem with server" });
  }
};

const updateRecipeVariation = async (req, res) => {
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
    } else {
      console.log("error updatin recipe variation");
      res.status(400).json({ status: 400, message: "no recipe found" });
    }
  } catch (error) {
    console.log("Error udpating recipe variation", error);
    res.status(500).json({ status: 500, message: "Error updating recipe" });
  }
};

const updateRecipePrivacy = async (req, res) => {
  const query = { _id: req.body._id };
  const updatePrivacy = { $set: { isPrivate: req.body.isPrivate } };

  try {
    const result = await Recipe.updateOne(query, updatePrivacy);
    if (result) {
      res.status(200).json({ status: 200, message: "recipe privacy updated" });
    } else {
      console.log("error in updating privacy");
      res.status(400).json({ status: 400, message: "no recipe found" });
    }
  } catch (error) {
    console.log("error updating recipe", err);
    res.status(500).json({ status: 500, message: "Error updating privacy" });
  }
};

const deleteRecipe = async (req, res) => {
  // update the isDeleted flag of this recipe
  const selectedRecipeId = { _id: req.body._id };
  const updateDelete = { $set: { isDeleted: true } };
  // find the original recipe
  // and remove the selected recipe from the variations array
  const originalRecipeId = { _id: req.body.originalRecipe };

  try {
    const findOriginal = await Recipe.findOne(originalRecipeId);
    if (findOriginal) {
      let newVariationsArray = findOriginal.variations;
      // find the id to remove
      let index = newVariationsArray.findIndex((variation) => {
        return variation.variationId === req.body._id;
      });

      if (index >= 0) {
        newVariationsArray.splice(index, 1);
        let newVariationsArrayObject = {
          $set: { variations: newVariationsArray },
        };
        const updateOriginalRecipeVariations = await Recipe.updateOne(
          originalRecipeId,
          newVariationsArrayObject
        );
        if (updateOriginalRecipeVariations) {
          console.log("update", updateOriginalRecipeVariations);
          res.status(204).json({
            status: 204,
            message: "recipe removed from original recipe's variations array",
          });
        }
      }
    }
    // switch the isDeleted to true on the selectedRecipe
    const deleteRecipe = await Recipe.updateOne(selectedRecipeId, updateDelete);
    if (deleteRecipe) {
      console.log("Recipe deleted");
      res.status(204).json({ status: 204, message: "Recipe deleted" });
    } else {
      console.log("error deleting the recipe");
      res.status(400).json({ status: 400, message: "no recipe found" });
    }
  } catch (err) {
    console.log("Error deleting recipe", err);
  }
};

const likeRecipe = async (req, res) => {};

//USER PAGE
const getMultipleRecipes = async (req, res) => {
  try {
    const findRecipes = await Recipe.find({
      createdBy: req.params._id,
      isDeleted: false,
    });
    if (findRecipes) {
      const sortedResults = findRecipes.sort((a, b) => b.date - a.date);

      res.status(200).json({ status: 200, data: sortedResults });
    }
  } catch (error) {
    console.log("error", error);
    res.status(404).json({ status: 404, message: "Error" });
  }
};

//deactive user account deletes their recipes.
//find recipes created by the userId and delete them
const deleteRecipeByUserId = async (req, res) => {
  try {
    const result = await Recipe.deleteMany({ createdBy: req.params._id });
    if (result) {
      res.status(200).json({ status: 200, data: result });
    }
  } catch (error) {
    console.log("error deleting recipes by userId", error);
    res.status(400).json({ status: 400, message: "Error deleting recipes" });
  }
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
  updateRecipePrivacy,
};
