import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/user-controller";

import { protect } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, getUser);

export default router;
