import express, { type Express } from "express";
import cors from "cors";
import booksRouter from "./routes/booksRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import { connectDB } from "./config/db";
// import dotenv from "dotenv";
// const PORT = process.env.PORT || 5000;
const PORT = 5000;

connectDB()
  .then()
  .catch((e) => {
    console.error(e);
  });

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/books", booksRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`now listening on port`, PORT);
});
