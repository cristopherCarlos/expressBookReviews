const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { 
    "username": "cristopher",
    "password": "password1"
 },
];

const isValid = (username) => {
    // Verifica si el usuario ya existe en la lista
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
    // Verifica si el usuario y contraseña coinciden con los registros
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

//only registered users can login
// Tarea 7: Iniciar sesión como usuario registrado
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error al iniciar sesión" });
  }

  // Comprobar si el usuario es válido
  if (authenticatedUser(username, password)) {
    // Generar Token de Acceso (JWT)
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Guardar el token en la sesión
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("Usuario logueado con éxito");
  } else {
    return res.status(208).json({ message: "Inicio de sesión inválido. Verifique usuario y contraseña" });
  }
});

// Add a book review 
// Tarea 8: Añadir o modificar una reseña de libro
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
      // Asignar o actualizar la reseña del usuario actual
      books[isbn].reviews[username] = review;
      
      return res.status(200).json({
          message: `La reseña del usuario ${username} ha sido guardada.`,
          reviews: books[isbn].reviews
      });
  } else {
      return res.status(404).json({message: "Libro no encontrado"});
  }
});


// Tarea 9: Eliminar reseña
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).send(`Reseña de ${username} eliminada.`);
    }
    res.status(404).json({ message: "Reseña no encontrada" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
