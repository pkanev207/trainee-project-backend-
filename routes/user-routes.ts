import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
} from "../controllers/user-controller";

import { protect, isAdmin } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, isAdmin, getUser);
router.put("/update", protect, updateUser);

export default router;
