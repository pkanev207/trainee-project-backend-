"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const books_routes_1 = __importDefault(require("./routes/books-routes"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const error_middleware_1 = require("./middleware/error-middleware");
const db_1 = require("./config/db");
const validate_env_1 = __importDefault(require("./util/validate-env"));
(0, db_1.connectDB)()
    .then(() => {
    const PORT = validate_env_1.default.PORT;
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cors_1.default)());
    app.use("/api/books", books_routes_1.default);
    app.use("/api/users", user_routes_1.default);
    app.use((req, res, next) => {
        next(new Error("Endpoint not found"));
    });
    app.use(error_middleware_1.errorHandler);
    app.listen(PORT, () => {
        console.log(`now listening on port`, PORT);
    });
})
    .catch((e) => {
    console.error(e);
});
