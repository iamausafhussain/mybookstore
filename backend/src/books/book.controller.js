const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        const newBook = await Book({ ...req.body });
        await newBook.save();
        res.status(200).send({message: "Book created successfully", book: newBook})
    } catch (error) {
        console.error("Error creating book"),
        res.status(418).send({message: "Failed to create a book"})
    }
}

module.exports = {postABook}