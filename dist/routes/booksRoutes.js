"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booksController_1 = require("../controllers/booksController");
const router = express_1.default.Router();
router.route("/").get(booksController_1.getAllBooks).post(booksController_1.createBook);
// router.get("/", getAllBooks);
// router.post("/", createBook);
router.route("/:id").put(booksController_1.updateBook).delete(booksController_1.deleteBook);
// router.put("/:id", updateBook);
// router.delete("/:id", deleteBook);
exports.default = router;
