import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  adminDeleteUser,
} from "../controllers/user-controller";

import { protect, isAdmin } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", protect, updateUser);
router.get("/user", protect, isAdmin, getUser);
router.delete("/admin/user/:id", protect, isAdmin, adminDeleteUser);

export default router;
