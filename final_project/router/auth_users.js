const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check if the username is already registered in the users array
  const user= users.some(user => user.username === username);
  if (user){
    return false;
  }
  return true;

}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if the username and password match any user in the users array


  for(let user of users){
    if(user.username === username && user.password === password){
      return true;
    }
  }
  return false;

}

//only registered users can login
regd_users.post("/login", (req,res) => {


const {username, password} = req.body;



if(!authenticatedUser(username, password)){
    return res.status(208).json({message: "Invalid Login. Check username and password"});
}

const token = jwt.sign({ data:password }, 'access', { expiresIn:  '1h' });
req.session.authorization = {
  token, username
}
return res.status(200).send("User successfully logged in");

 
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Vous devez donner une critique comme une requête de query et elle doit être postée avec le nom d'utilisateur (stocké dans la session) posté. Si le même utilisateur poste une critique différente sur le même ISBN, cela devrait modifier la critique existante. Si un autre utilisateur se connecte et poste une critique sur le même ISBN, cela sera ajouté comme une critique différente sous le même ISBN.
  // implémentez la logique ici pour ajouter ou modifier la critique
  const { isbn } = req.params;
  const { review } = req.query;
  console.log(isbn);
  const { username } = req.session.authorization;
  const user = users.find(user => user.username === username);
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const existingReview = book.reviews[username];
  if (existingReview) {
    books[isbn].reviews[username]=review;
  
  } else {
    books[isbn].reviews[username]=review;
  }
  if(existingReview)
  {
    return res.status(200).json({ message: `Review updated successfully for book with ISBN ${isbn}` });
  }
  else{
    console.log(books[isbn].reviews[username]);
    return res.status(201).json({ message: `Review added successfully for book with ISBN ${isbn}` });
  }



});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Implémentez la logique ici pour supprimer la critique de l'ISBN donné et du nom d'utilisateur
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }
  // Suppression de la critique
  delete book.reviews[username]; 
  return res.status(200).json({ message: `Review posted by the user ${username} for the book with isbn ${isbn}  deleted successfully` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
