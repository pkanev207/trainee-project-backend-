import express, { type Express } from "express";
import cors from "cors";
import booksRouter from "./routes/books-routes";
import userRouter from "./routes/user-routes";
import { errorHandler } from "./middleware/error-middleware";
import { connectDB } from "./config/db";
import env from "./util/validate-env";

connectDB()
  .then(() => {
    const PORT = env.PORT;
    const app: Express = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());

    app.use("/api/books", booksRouter);
    app.use("/api/users", userRouter);

    app.use((req, res, next) => {
      next(new Error("Endpoint not found"));
    });

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`now listening on port`, PORT);
    });
  })
  .catch((e) => {
    console.error(e);
  });
