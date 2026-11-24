const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "books.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readBooks() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveBooks(books) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
}

// GET /books - return all books
app.get("/books", (req, res) => {
  res.json(readBooks());
});

// POST /books - add a book
app.post("/books", (req, res) => {
  const { title, author, category, year } = req.body;
  const currentYear = new Date().getFullYear();

  if (!title?.trim() || !author?.trim() || !category?.trim() ||
      year === undefined || year === null || year === "") {
    return res.status(400).json({ error: "Title, author, category and year are required." });
  }

  const bookYear = Number(year);
  if (!Number.isInteger(bookYear) || bookYear < 1 || bookYear > currentYear) {
    return res.status(400).json({ error: `Year must be a whole number between 1 and ${currentYear}.` });
  }

  const books = readBooks();
  const newBook = {
    id: Date.now().toString(),
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    year: bookYear
  };

  books.push(newBook);
  saveBooks(books);
  res.status(201).json(newBook);
});

// DELETE /books/:id - remove a book by its ID
app.delete("/books/:id", (req, res) => {
  const books = readBooks();
  const updatedBooks = books.filter(book => book.id !== req.params.id);

  if (updatedBooks.length === books.length) {
    return res.status(404).json({ error: "Book not found." });
  }

  saveBooks(updatedBooks);
  res.json({ message: "Book deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`Library Book Tracker running at http://localhost:${PORT}`);
});
