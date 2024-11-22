const express = require('express');
const { postABook, getAllBooks, getABook, updateABook, deleteABook, getBooksByIds } = require('./book.controller');
const router = express.Router();

// post a book

router.post("/createBook", postABook)
router.get("/getBooks", getAllBooks)
router.get("/getBooks/:id", getABook)
router.post("/getBooksByIds", getBooksByIds)
router.put("/updateBook/:id", updateABook)
router.delete("/deleteBook/:id", deleteABook)

module.exports = router;