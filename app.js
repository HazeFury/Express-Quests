const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers")
const login = require("./login")
const { hashPassword, verifyPassword, verifyToken } = require("./auth");


// *********  Public routes  *************

app.post("/api/login",
  login.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword );

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.post("/api/users", hashPassword, userHandlers.postUser);

// *********  Protected routes  *************
app.use(verifyToken);

app.post("/api/movies", movieHandlers.postMovie);

app.put("/api/movies/:id", movieHandlers.updateMovie);
app.put("/api/users/:id", hashPassword, userHandlers.updateUser);

app.delete("/api/users/:id", userHandlers.deleteUser);

// *******************************************

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
