"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const booksRoutes_1 = __importDefault(require("./routes/booksRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const db_1 = require("./config/db");
// import dotenv from "dotenv";
// const PORT = process.env.PORT || 5000;
const PORT = 5000;
(0, db_1.connectDB)()
    .then()
    .catch((e) => {
    console.error(e);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use("/api/books", booksRoutes_1.default);
app.use(errorMiddleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`now listening on port`, PORT);
});
