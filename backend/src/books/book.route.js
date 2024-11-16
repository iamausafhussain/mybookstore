const express = require('express');
const { postABook } = require('./book.controller');
const router = express.Router();

// post a book

router.post("/create-book", postABook)

// get all books

router.get("/get")

module.exports = router;