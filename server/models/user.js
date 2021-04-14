const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const schema = new Schema({
  handle: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isSignedIn: { type: Boolean, required: true },
  deactivated: { type: Boolean, required: true },
  recipesCreated: [],
  recipesImproved: [],
  avatarUrl: { type: String },
  bio: { type: String },
});

module.exports = mongoose.model("User", schema, "users");
