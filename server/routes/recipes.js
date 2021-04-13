const express = require("express");
const {
  getAllRecipes,
  getOneRecipe,
  editRecipe,
  likeRecipe,
  createRecipe,
} = require("./handlers/recipe-handlers");
const router = express.Router();

//all recipes
router.get("/all", getAllRecipes);
//one recipe
router.get("/:_id", getOneRecipe);

//create recipe
router.post("/create", createRecipe);

//editRecipe
//likeRecipe

module.exports = router;
