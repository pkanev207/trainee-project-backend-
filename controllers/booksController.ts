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
