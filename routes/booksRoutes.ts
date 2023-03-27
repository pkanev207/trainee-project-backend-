import express from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/booksController";
const router = express.Router();

router.route("/").get(getAllBooks).post(createBook);
// router.get("/", getAllBooks);
// router.post("/", createBook);
router.route("/:id").put(updateBook).delete(deleteBook);
// router.put("/:id", updateBook);
// router.delete("/:id", deleteBook);

export default router;
