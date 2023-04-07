import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
} from "../controllers/userController";

import {} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/user", protect, getUser);
router.get("/user", getUser);

export default router;
