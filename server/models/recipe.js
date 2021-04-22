const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const schema = new Schema({
  recipeName: { type: String, required: true },
  //IMAGE?
  ingredients: [{ ingredient: String }],
  directions: [{ direction: String, ingredients: [{ ingredient: String }] }],
  likedBy: [{ type: String }],
  //if created by form it will be original, if altered by user it will be false
  isOriginal: { type: Boolean },
  originalRecipe: { type: String },
  createdBy: { type: String },
  //id's of edits of this recipe
  variations: [
    { variationId: { type: String }, variationTitle: { type: String } },
  ],
  //user can decide to make their recipe private.
  isPrivate: { type: Boolean },
  // soft delete
  isDeleted: { type: Boolean },
  //upload an image/
  recipeImageUrl: { type: String },
  //timestamp of when recipe is sent to the db
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", schema, "recipes");
