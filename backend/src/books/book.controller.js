const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        const newBook = await Book({ ...req.body });
        await newBook.save();
        res.status(201).send({ message: "Book created successfully", book: newBook })
    } catch (error) {
        console.error("Error creating book");
        res.status(418).send({ message: "Failed to create a book. You might be missing some fields that are actually required!" })
    }
}

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).send(books)
    } catch (error) {
        console.error("Error fetching books");
        res.status(418).send({ message: "Failed to fetch books." })
    }
}

const getABook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);

        if (!book) {
            res.status(404).send(`Book with id ${id} not found!`)
        }

        res.status(200).send(book)


    } catch (error) {
        console.error("Error fetching book");
        res.status(418).send({ message: `Book with id ${id} not found!` })
    }
}

const updateABook = async (req, res) => {
    const { id } = req.params;
    try {
        const updateBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updateBook)
            res.status(404).send(`Book with id ${id} not found!`)

        res.status(200).send({ message: `Book ${id} updated successfully!`, book: updateBook })
    } catch (error) {
        console.error("Error fetching book");
        res.status(418).send({ message: `Book with id ${id} not found!` })
    }
}

const deleteABook = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteBook = await Book.findByIdAndDelete(id);
        if (!deleteBook)
            res.status(404).send(`Book with id ${id} not found!`)
        res.status(200).send({ message: `Book ${id} deleted successfully!`, book: deleteBook })
    } catch (error) {
        console.error("Error deleting book");
        res.status(418).send({ message: `Book with id ${id} not found!` })
    }
}

const getBooksByIds = async (req, res) => {
    const { productsIds } = req.body;
    try {
        if (!productsIds || productsIds.length === 0) {
            return res.status(400).send("No productsIds provided");
        }

        const books = await Book.find({ _id: { $in: productsIds } });

        if (!books || books.length === 0) {
            return res.status(404).send(`Books with the provided productsIds not found!`);
        }

        res.status(200).send(books);

    } catch (error) {
        console.error("Error fetching books", error);
        res.status(418).send({ message: `Failed to fetch books.` });
    }
}

module.exports = { postABook, getAllBooks, getABook, updateABook, deleteABook, getBooksByIds }