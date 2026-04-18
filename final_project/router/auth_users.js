const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { "username": "cristopher", "password": "password1" }
];

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
}

// Tarea 7: Login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Datos incompletos" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).send("Usuario logueado con éxito");
    } else {
        return res.status(208).json({ message: "Credenciales inválidas" });
    }
});

// Tarea 8: Añadir/Modificar reseña
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({
            message: `Reseña de ${username} guardada.`,
            reviews: books[isbn].reviews
        });
    }
    res.status(404).json({ message: "Libro no encontrado" });
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