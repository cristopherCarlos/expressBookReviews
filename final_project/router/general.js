const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Tarea 6: Registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Verificar si el usuario ya existe
    const exists = users.filter((user) => user.username === username);
    if (exists.length === 0) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Usuario registrado exitosamente. ¡Ahora puedes iniciar sesión!" });
    } else {
      return res.status(404).json({ message: "El usuario ya existe" });
    }
  }
  return res.status(404).json({ message: "No se proporcionó usuario o contraseña" });
});

// Get the book list available in the shop
// Tarea 1: Obtener la lista de libros disponibles en la tienda
public_users.get('/', function (req, res) {
  // Usamos JSON.stringify para darle un formato legible (indentación de 4 espacios)
  return res.status(200).send(JSON.stringify(books, null, 4));
});


// Get book details based on ISBN
// Tarea 2: Obtener detalles del libro basados en el ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Obtenemos el parámetro de la URL
  const book = books[isbn];    // Buscamos el libro en nuestro objeto books

  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
});
  
// Get book details based on author
// Tarea 3: Obtener detalles del libro basados en el autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;          // Obtenemos el autor de la URL
  const all_isbns = Object.keys(books);      // Obtenemos todos los ISBN (las llaves)
  const filtered_books = [];                 // Array para guardar las coincidencias

  all_isbns.forEach(isbn => {
    if (books[isbn].author === author) {
      filtered_books.push({
        "isbn": isbn,
        "title": books[isbn].title,
        "reviews": books[isbn].reviews
      });
    }
  });

  if (filtered_books.length > 0) {
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } else {
    return res.status(404).json({ message: "No se encontraron libros de este autor" });
  }
});

// Get all books based on title
// Tarea 4: Obtener detalles del libro basados en el título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;            // Obtenemos el título de la URL
  const all_isbns = Object.keys(books);      // Obtenemos todas las llaves (ISBNs)
  const filtered_books = [];                 // Array para almacenar coincidencias

  all_isbns.forEach(isbn => {
    if (books[isbn].title === title) {
      filtered_books.push({
        "isbn": isbn,
        "author": books[isbn].author,
        "reviews": books[isbn].reviews
      });
    }
  });

  if (filtered_books.length > 0) {
    return res.status(200).send(JSON.stringify(filtered_books, null, 4));
  } else {
    return res.status(404).json({ message: "No se encontraron libros con este título" });
  }
});

//  Get book review
// Tarea 5: Obtener las reseñas del libro basados en el ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    // Solo devolvemos el objeto de reseñas
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
});

module.exports.general = public_users;
