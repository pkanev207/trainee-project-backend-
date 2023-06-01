import express, { type Express } from "express";
import cors from "cors";
import fs from "fs";
import booksRouter from "./routes/books-routes";
import userRouter from "./routes/user-routes";
import { errorHandler } from "./middleware/error-middleware";
import { connectDB } from "./config/db";
import env from "./util/validate-env";
import SwaggerUi from "swagger-ui-express";
import YAML from "js-yaml";
import fileUpload from "express-fileupload";

connectDB()
  .then(() => {
    const PORT = env.PORT;
    const app: Express = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/temp/",
        limits: { fileSize: 50 * 1024 * 1024 },
      })
    );

    app.use("/api/users", userRouter);
    app.use("/api/books", booksRouter);

    try {
      const swaggerDocument = YAML.load(
        fs.readFileSync("./specs/swagger.yaml", "utf-8")
      );
      app.use(
        "/api-docs",
        SwaggerUi.serve,
        SwaggerUi.setup(swaggerDocument as any)
      );
    } catch (error) {
      console.error(error);
    }

    app.use((req, res, next) => {
      console.log(req.url);

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
