import { isValidObjectId } from "mongoose";
import asyncHandler from "express-async-handler";
import type { RequestHandler } from "express";
import Book from "../models/book-model";
// import { type ObjectId } from "mongodb";

// @route GET/api/books
export const getAllBooks: RequestHandler = asyncHandler(async (req, res) => {
  const books: any = await Book.find()
    .populate("user", ["name", "role"])
    .lean();
  res.status(200).json({ books });
});

// @route GET/api/books/paginated
export const getAllBooksPaginated = asyncHandler(async (req, res) => {
  const query = Book.find({});

  let page: number = parseInt(req.query.page as string);
  if (Number.isNaN(page) || page === 0) {
    page = 1;
  }

  let pageSize: number = parseInt(req.query.limit as string);
  if (Number.isNaN(pageSize) || pageSize === 0) {
    pageSize = 2;
  }

  const skip = (page - 1) * pageSize;
  const total = await Book.countDocuments();
  const pages = Math.ceil(total / pageSize);

  if (page > pages) {
    res.status(404);
    throw new Error("Page not found");
  }

  // descending order
  const books = await Book.find().sort({ _id: -1 }).limit(pageSize).skip(skip);
  console.log(books);

  const result = await query.skip(skip).limit(pageSize);

  res.status(200).json({
    status: "success",
    count: result.length,
    page,
    pages,
    data: result,
  });
});

// @route GET/api/books/:id
export const getBookById: RequestHandler = asyncHandler(async (req, res) => {
  // const book = await validateBook(req.params._id, res);
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid book id");
  }
  const book = await Book.findById(req.params.id);
  if (book === undefined || book === null) {
    res.status(404);
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
export const getUserBooks: RequestHandler = asyncHandler(async (req, res) => {
  const books = await Book.find({ user: req.user.id });
  if (books === undefined || books === null) {
    res.status(404);
    throw new Error("Books not found");
  }
  res.status(200).json({ books });
});

interface CreateBookBody {
  title?: string;
  description?: string;
  imgUrl?: string;
  author?: string;
}

// @route POST/api/books
export const createBook: RequestHandler<
  unknown,
  unknown,
  CreateBookBody,
  unknown
> = asyncHandler(async (req, res) => {
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

  res.status(201).json(book);
});

interface UpdateBookParams {
  id: string;
}

interface UpdateBookBody {
  title?: string;
  description?: string;
  imgUrl?: string;
  author?: string;
}

// @route PUT/api/books/:id
export const updateBook: RequestHandler<
  UpdateBookParams,
  unknown,
  UpdateBookBody,
  unknown
> = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid book id");
  }
  const book = await Book.findById(req.params.id);
  if (book === undefined || book === null) {
    res.status(404);
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
  // create new if there is no such book
  // const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true,});
  // sending the old book ?
  // res.json(await Book.findByIdAndUpdate(req.params.id, req.body));
  await Book.findByIdAndUpdate(req.params.id, req.body);
  res.json(await Book.findById(req.params.id));
});

// @route DELETE/api/books/:id
export const deleteBook: RequestHandler = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid book id");
  }
  const book = await Book.findById(req.params.id);
  if (book === undefined || book === null) {
    res.status(404);
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

// interface bookShape {
//   _id: ObjectId;
//   title?: string;
//   description?: string;
//   imgUrl?: string;
//   author?: string;
//   user?: Types.ObjectId;
//   userName?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// async function validateBook(id: string, res: Response): Promise<bookShape> {
//   if (!isValidObjectId(id)) {
//     res.status(400);
//     throw new Error("Invalid book id");
//   }
//   const book = await Book.findById(id);
//   if (book === undefined || book === null) {
//     res.status(404);
//     throw new Error("Book not found");
//   }

//   return book;
// }

// RequestHandler<params, res.body, req.body, queries>

// for joining two models
// async function createModel(trip) {
//     const result = new Model(trip);
//     await result.save();
//     // after creation in order to have id
//     const user = await User.findById(result.owner);
//     user.models.push(result._id);
//     await user.save();

//     return result;
// }

// .sendStatus || .status.json
