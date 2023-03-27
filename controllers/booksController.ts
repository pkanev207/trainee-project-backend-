import asyncHandler from "express-async-handler";

// @desc Get all books
// @route GET/api/books
// @access Public
export const getAllBooks = asyncHandler(async (req, res) => {
  const books = ["book1", "book2", "book3"];
  res.status(200).json({ books });
});

// @desc Create book
// @route POST/api/books
// @access Private
export const createBook = asyncHandler(async (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "books are coming!" });
});

// @desc Update book
// @route PUT/api/books/:id
// @access Private
export const updateBook = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  res.status(200).json({ message: "Edit books!!" });
});

// @desc Delete book
// @route DELETE/api/books/:id
// @access Private
export const deleteBook = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  res.status(200).json({ message: "Deleted book!!" });
});
