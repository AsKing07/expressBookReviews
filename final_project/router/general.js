const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');




public_users.post("/register", (req,res) => {
  // The code should take the ‘username’ and ‘password’ provided in the body of the request for registration. If the username already exists, it must mention the same & must also show other errors like eg. when username &/ password are not provided.
  const { username, password } = req.body;
  if (!username ||!password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  users.push({ username, password });
  console.log(users)
  res.json({ message: 'User registered successfully' });


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 console.log(books);
  res.json(books);
});
//get the list of books available in the shop  using Promise callbacks or async-await with Axios.
public_users.get('/books',function (req, res) {
  axios.get('http://localhost:3000/')
   .then(response => {
      res.json(response.data);
    })
   .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching books' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book); 
 });
//  Search by ISBN – Using Promises
public_users.get('/getByIsbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:3000/isbn/${isbn}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching book' });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author
  const booksByAuthor = Object.values(books).filter((book) => book.author === author);
  if (!booksByAuthor.length) {
    return res.status(404).json({ message: 'No books found by this author' });
  }
  res.json(booksByAuthor);
 });

 //  Search by Author – Using Promises
 public_users.get('/getByAuthor/:author',function (req, res) {
  const author = req.params.author;
  axios.get(`http://localhost:3000/author/${author}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching books' });
    });
});

  
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const booksByTitle = Object.values(books).filter((book) => book.title === title);
  if (!booksByTitle.length) {
    return res.status(404).json({ message: 'No books found by this title' });
  }
  res.json(booksByTitle);
});
 //  Search by Title – Using Promises
 public_users.get('/getByTitle/:title',function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:3000/title/${title}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching books' });
    });
}); 


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book.reviews);
 
});

module.exports.general = public_users;
