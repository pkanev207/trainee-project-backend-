import express, { type Express } from "express";
import cors from "cors";
import booksRouter from "./routes/books-routes";
import userRouter from "./routes/user-routes";
import { errorHandler } from "./middleware/error-middleware";
import { connectDB } from "./config/db";
import "dotenv/config";
const PORT = process.env.PORT ?? 5000;
// const PORT = 5000;
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
app.use("/api/users", userRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`now listening on port`, PORT);
});
