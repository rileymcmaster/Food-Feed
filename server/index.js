const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

require("dotenv").config();

//routes/
const recipeRouter = require("./routes/recipes");
const userRouter = require("./routes/user");

const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(MONGO_URI, options)
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.log("Error with mongoose", err));

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  //RECIPES
  .use("/recipes", recipeRouter)
  //USERS
  .use("/user", userRouter)

  .get("*", (req, res) => {
    res.status(400).send("Page not found");
  })

  .listen(process.env.PORT || 4000, () =>
    console.info(`Listening on port 4000`)
  );
