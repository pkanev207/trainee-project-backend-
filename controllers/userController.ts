import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
// const secret = process.env.JWT_SECRET;
const secret = "traineeproject123";

// interface UserInterface {
//   _id: string;
//   name: string;
//   email: string;
//   token: string;
// }

// @desc Register new user
// @route POST/api/users/register
// @access Public
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (name === "" || email === "" || password === "") {
      res.status(400);
      throw new Error("Please add all fields");
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    console.log(existingUser);

    if (existingUser !== null) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });
    if (user.email !== "") {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id as any),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
);

// @desc Authenticate a user
// @route POST/api/users/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check for user email
  const user = await User.findOne({ email });
  const nativePassword = user?.password;
  const compareResult = await bcrypt.compare(password, nativePassword as any);

  if (user?.email !== "" && compareResult) {
    res.json({
      _id: user?.id,
      name: user?.name,
      email: user?.email,
      token: generateToken(user?._id as any),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc Get user's data
// @route GET/api/users/user
// @access Private
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  console.log(req.user._id.toString());
  res.status(200).json(req.user);
  //   const { _id, name, email } = await User.findById(req.user.id);
  //   res.status(200).json({ id: _id, name, email });
});

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};
