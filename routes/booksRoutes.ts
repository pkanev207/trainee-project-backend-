import express from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getUserBooks,
} from "..//controllers/booksController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").get(getAllBooks).post(protect, createBook);
router.get("/user", protect, getUserBooks);
router.route("/:id").put(protect, updateBook).delete(protect, deleteBook);

export default router;
