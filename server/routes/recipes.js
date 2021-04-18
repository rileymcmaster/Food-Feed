const express = require("express");
const {
  getAllRecipes,
  getOneRecipe,
  editRecipe,
  deleteRecipe,
  likeRecipe,
  createRecipe,
  updateRecipeVariation,
  getMultipleRecipes,
  deleteRecipeByUserId,
} = require("./handlers/recipe-handlers");
const router = express.Router();

//all recipes
router.get("/all/:_id", getAllRecipes);
//one recipe
router.get("/:_id", getOneRecipe);

//create recipe
router.post("/create", createRecipe);

//editRecipe
router.post("/create/edit", editRecipe);

//updateRecipe
router.patch("/update/", updateRecipeVariation);

//deleteRecipe
router.delete("/delete/", deleteRecipe);

//get recipe by author id
router.get("/user/:_id", getMultipleRecipes);

//delete user account, deletes their recipes
router.delete("/user/delete/:_id", deleteRecipeByUserId);

//likeRecipe

module.exports = router;
