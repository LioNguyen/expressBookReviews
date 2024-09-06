const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return !!users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return !!users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { body } = req || {};
  const { username, password } = body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username or Password are not provided." });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username, password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = {
      username,
      accessToken,
    };
    return res.status(201).json({ message: "Login success!" });
  }

  res.status(401).json({ message: "Login failed!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { params, query } = req || {};
  const { isbn } = params || {};
  const { review } = query || {};
  const username = req.session?.authorization?.username;

  if (!isbn || !username) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res
    .status(200)
    .json({ message: "Review added/modified successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { params, query } = req || {};
  const { isbn } = params || {};
  const { review } = query || {};
  const username = req.session?.authorization?.username;

  if (!isbn || !username) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Delete review successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
