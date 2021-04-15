const express = require("express");
const {
  getAllRecipes,
  getOneRecipe,
  editRecipe,
  likeRecipe,
  createRecipe,
  updateRecipeVariation,
  getMultipleRecipes,
} = require("./handlers/recipe-handlers");
const router = express.Router();

//all recipes
router.get("/all", getAllRecipes);
//one recipe
router.get("/:_id", getOneRecipe);

//create recipe
router.post("/create", createRecipe);

//editRecipe
router.post("/create/edit", editRecipe);

//updateRecipe
router.patch("/update/", updateRecipeVariation);

//get multiple recipes
// router.get("/multiple", );

//get recipe by author id
router.get("/user/:_id", getMultipleRecipes);

//likeRecipe

module.exports = router;
