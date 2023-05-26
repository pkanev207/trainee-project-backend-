import { isValidObjectId } from "mongoose";
import asyncHandler from "express-async-handler";
import type { RequestHandler } from "express";
import Book from "../models/book-model";
// import { type ObjectId } from "mongodb";
import { uploadToCloudinary, deleteFromCloudinary } from "../util/cloudinary";

// @route GET/api/books
export const getAllBooks: RequestHandler = asyncHandler(async (req, res) => {
  const books: any = await Book.find()
    .populate("user", ["name", "role"])
    .lean();
  res.status(200).json({ books });
});

// @route GET/api/books/paginated
export const getAllBooksPaginated = asyncHandler(async (req, res) => {
  let page: number = parseInt(req.query.page as string);
  if (Number.isNaN(page) || page === 0) {
    page = 1;
  }

  let pageSize: number = parseInt(req.query.limit as string);
  if (Number.isNaN(pageSize) || pageSize === 0) {
    pageSize = 3;
  }

  const searchTerm = req.query.query;
  const skip = (page - 1) * pageSize;

  let total = await Book.countDocuments();
  let pages = Math.ceil(total / pageSize);
  let books = [];

  if (page > pages) {
    res.status(404);
    throw new Error("Page not found");
  }

  if (searchTerm !== undefined && searchTerm !== "") {
    total = await Book.count({ title: { $regex: searchTerm, $options: "i" } });
    pages = Math.ceil(total / pageSize);
    books = await Book.find({ title: { $regex: searchTerm, $options: "i" } })
      .skip(skip)
      .limit(pageSize)
      .sort({ _id: 1 })
      .populate("user", ["name", "role"])
      .lean();

    res.status(200).json({
      status: "success",
      count: books.length,
      currentPage: page,
      numberOfPages: pages,
      data: books,
    });
  } else {
    books = await Book.find()
      .skip(skip)
      .limit(pageSize)
      .sort({ _id: -1 })
      .populate("user", ["name", "role"])
      .lean();

    res.status(200).json({
      status: "success",
      count: books.length,
      currentPage: page,
      numberOfPages: pages,
      data: books,
    });
  }
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

// @route POST/api/books/images/upload
export const imageUpload: RequestHandler = asyncHandler(async (req, res) => {
  console.log("From imageUpload:");
  res.status(200).json(req.body);
});

interface CreateBookBody {
  title?: string;
  description?: string;
  imgUrl?: string;
  cloudinaryId?: string;
  author?: string;
  cover?: HTMLImageElement;
}

// @route POST/api/books
export const createBook: RequestHandler<
  unknown,
  unknown,
  CreateBookBody,
  unknown
> = asyncHandler(async (req, res) => {
  let imgUrl, cloudinaryId;

  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("The user does not have access rights");
  }

  if (
    req.body.title === undefined ||
    req.body.description === undefined ||
    req.body.imgUrl === undefined ||
    req.body.author === undefined
  ) {
    res.status(400);
    throw new Error("Please add all input fields");
  }

  if (req.files !== null && req.files !== undefined) {
    const response = await uploadToCloudinary(req.files);
    imgUrl = response.url;
    cloudinaryId = response.cloudinary_id;
    console.log(imgUrl, cloudinaryId);
  } else {
    cloudinaryId = "none";
    imgUrl = req.body.imgUrl;
    // res.status(400);
    // throw new Error("No image was uploaded");
  }

  const book = await Book.create({
    title: req.body.title,
    description: req.body.description,
    imgUrl,
    cloudinaryId,
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
  cloudinaryId?: string;
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
  const book = await Book.findById(req.params.id.trim());
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
  // Check for new image upload
  if (req.files !== null && req.files !== undefined) {
    // clear the old image
    await deleteFromCloudinary(req.body.cloudinaryId ?? "");
    // create new image
    const response = await uploadToCloudinary(req.files);
    req.body.imgUrl = response.url;
    req.body.cloudinaryId = response.cloudinary_id;
    console.log(req.body.imgUrl, req.body.cloudinaryId);
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedBook);
});

// @route DELETE/api/books/:id
export const deleteBook: RequestHandler = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid book id");
  }
  // Find the book
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
  // Delete Cloudinary image
  const cloudinaryId = book.cloudinaryId;
  let cloudinaryRes: string = "";
  if (cloudinaryId === "none") {
    cloudinaryRes = " image missing required parameter - public_id";
  } else {
    try {
      await deleteFromCloudinary(cloudinaryId);
      cloudinaryRes = " and image";
    } catch (error) {
      console.error(error);
      // res.status(400);
      // throw new Error("Missing required parameter - public_id");
      // window.alert(error.name);
      cloudinaryRes = "image missing required parameter - public_id";
    }
  }

  await Book.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ message: `Deleted Book ${req.params.id}${cloudinaryRes}` });
});

// interface bookShape {
//   _id: ObjectId;
//   title?: string;
//   description?: string;
//   imgUrl?: string;
//   cloudinaryId: string;
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
