const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const bookList = Object.entries(books).map((book) => book[1]);

public_users.post("/register", (req, res) => {
  //Write your code here
  const { body } = req || {};
  const { username, password } = body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username or Password are not provided." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User existed!" });
  }

  users.push({
    username,
    password,
  });
  res.status(201).send(`${username} created!`);
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const { params } = req || {};
  if (params?.isbn) {
    const currentBook = books[params?.isbn];
    if (currentBook) {
      return res.status(200).send(JSON.stringify(currentBook, null, 4));
    }
    return res.status(404).json({ message: "Book not found!" });
  }

  return res.status(404).json({ message: "ISBN not valid!" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const { params } = req || {};
  if (params?.author) {
    const currentAuthorBooks = bookList.filter(
      (book) => book.author === params?.author
    );
    if (currentAuthorBooks) {
      return res.status(200).send(JSON.stringify(currentAuthorBooks, null, 4));
    }
    return res.status(404).json({ message: "Author not found!" });
  }

  return res.status(404).json({ message: "Author not valid!" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const { params } = req || {};
  if (params?.title) {
    const currentBook = bookList.find((book) => book.title === params?.title);
    if (currentBook) {
      return res.status(200).send(JSON.stringify(currentBook, null, 4));
    }
    return res.status(404).json({ message: "Title not found!" });
  }

  return res.status(404).json({ message: "Title not valid!" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { params } = req || {};
  if (params?.isbn) {
    const currentBook = books[params?.isbn];
    if (currentBook && currentBook?.reviews) {
      return res
        .status(200)
        .send(JSON.stringify(currentBook?.reviews, null, 4));
    }
    return res.status(404).json({ message: "Review not found!" });
  }

  return res.status(404).json({ message: "ISBN not valid!" });
});

module.exports.general = public_users;
