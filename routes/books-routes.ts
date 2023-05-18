import express from "express";
import {
  getAllBooks,
  getAllBooksPaginated,
  getBookById,
  getUserBooks,
  imageUpload,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/books-controller.js";
import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/").get(getAllBooks).post(protect, createBook);
router.route("/user").get(protect, getUserBooks);
router.route("/paginated").get(getAllBooksPaginated);
router
  .route("/:id")
  .get(protect, getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

router.post("/images/upload", imageUpload);

export default router;
