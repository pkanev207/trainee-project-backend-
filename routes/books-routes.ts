import express from "express";
import {
  getAllBooks,
  getBookById,
  getUserBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/books-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();
router.route("/").get(getAllBooks).post(protect, createBook);
router
  .route("/:id")
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);
router.get("/user", protect, getUserBooks);

export default router;
