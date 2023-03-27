import asyncHandler from "express-async-handler";
import { Book } from "../models/bookModel";

// @desc Get all books
// @route GET/api/books
// @access Public
export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();
  res.status(200).json({ books });
});

// @desc Create book
// @route POST/api/books
// @access Private
export const createBook = asyncHandler(async (req, res) => {
  if (req.body.title === undefined) {
    res.status(400);
    throw new Error("Please add a title!");
  }

  const book = await Book.create({
    title: req.body.title,
  });

  res.json(book);
});

// @desc Update book
// @route PUT/api/books/:id
// @access Private
export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  console.log(typeof book, book);
  if (book == null) {
    res.status(400);
    throw new Error("Book not found");
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updatedBook);
});

// @desc Delete book
// @route DELETE/api/books/:id
// @access Private
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book == null) {
    res.status(400);
    throw new Error("Book not found");
  }

  await Book.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: `Deleted book ${req.params.id}` });
});
