const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const app = express();

const port = 3000

// middleware
app.use(express.json())
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))

// routes
const bookRoutes = require("./src/books/book.route")
app.use("/api/books", bookRoutes)

async function main() {
  await mongoose.connect(process.env.DB_URL);


  app.get('/', (req, res) => {
    res.send("Welcome to backend server")
  })
}

main().then(() => console.log("MongoDB connected Successfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})