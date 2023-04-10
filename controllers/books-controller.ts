import asyncHandler from "express-async-handler";
import { Book } from "../models/book-model.js";

// @route GET/api/books
export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate("user", ["name", "role"]);
  res.status(200).json({ books });
});

// @route GET/api/books/:id
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book === undefined || book === null) {
    res.status(400);
    throw new Error("Book not found");
  }
  // Check for user
  if (req.user === undefined || req.user === null) {
    res.status(401);
    throw new Error("User not found");
  }

  res.status(200).json({ book });
});

// @route GET/api/books/user
export const getUserBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ user: req.user.id });
  res.status(200).json({ books });
});

// @route POST/api/books
export const createBook = asyncHandler(async (req, res) => {
  if (
    req.body.title === undefined ||
    req.body.description === undefined ||
    req.body.imgUrl === undefined ||
    req.body.author === undefined
  ) {
    res.status(400);
    throw new Error("Please add all input fields");
  }

  const book = await Book.create({
    title: req.body.title,
    description: req.body.description,
    imgUrl: req.body.imgUrl,
    author: req.body.author,
    user: req.user.id,
  });

  res.status(200).json(book);
});

// @route PUT/api/books/:id
export const updateBook = asyncHandler(async (req, res) => {
  const book = (await Book.findById(req.params.id)) ?? undefined;
  if (book === undefined) {
    res.status(400);
    throw new Error("Book not found");
  }
  // Check for user
  if (req.user === undefined) {
    res.status(401);
    throw new Error("User not found");
  }
  // Check if the logged user is the creator of the book
  if (book.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  // const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true,});
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body);
  res.json(updatedBook); // sending the old book ?
});

// @route DELETE/api/books/:id
export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book === undefined) {
    res.status(400);
    throw new Error("Book not found");
  }
  // Check for user
  if (req.user === undefined) {
    res.status(401);
    throw new Error("User not found");
  }
  // Make sure the logged user matches the book user
  if (book?.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await Book.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: `Delete Book ${req.params.id}` });
});
