const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 1: Obtener todos los libros
public_users.get('/', function (req, res) {
    res.status(200).send(JSON.stringify(books, null, 4));
});

// Tarea 2: ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const book = books[req.params.isbn];
    book ? res.status(200).json(book) : res.status(404).json({message: "No encontrado"});
});

// Tarea 3: Autor
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const results = Object.values(books).filter(b => b.author === author);
    res.status(200).json(results);
});

// Tarea 4: Título
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const results = Object.values(books).filter(b => b.title === title);
    res.status(200).json(results);
});

// Tarea 6: Registro
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!users.find(u => u.username === username)) {
            users.push({ username, password });
            return res.status(200).json({ message: "Registrado con éxito" });
        }
        return res.status(400).json({ message: "Ya existe" });
    }
    res.status(400).json({ message: "Faltan datos" });
});

module.exports.root = public_users;