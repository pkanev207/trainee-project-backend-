import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
// import { User } from "../models/user-model.js";
import User from "../models/user-model.js";
import env from "../util/validate-env.js";

// const secret = process.env.JWT_SECRET ?? "traineeproject123";
const secret = env.JWT_SECRET;

interface IRegisterBody {
  name?: string;
  email?: string;
  password?: string;
}

// @route POST/api/users/register
export const registerUser: RequestHandler<
  unknown,
  unknown,
  IRegisterBody,
  unknown
> = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (name === "" || email === "" || password === "") {
    res.status(400);
    throw new Error("Please add all fields");
  }
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser !== null) {
    res.status(400);
    throw new Error("User already exists");
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  if (password === null || password === undefined) {
    throw new Error("Unexpected error: Password is missing");
  }
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
});

interface ILoginBody {
  email?: string;
  password?: string;
}

// @route POST/api/users/login
export const loginUser: RequestHandler<unknown, unknown, ILoginBody, unknown> =
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check for user email
    const user = await User.findOne({ email }).select("+email +password");
    const nativePassword = user?.password;
    if (password === null || password === undefined) {
      throw new Error("Unexpected error: Password is missing");
    }
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

// @route GET/api/users/user
export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
  //   const { _id, name, email } = await User.findById(req.user.id);
  //   res.status(200).json({ id: _id, name, email });
});

// interface JwtPayload {
//   _id: string;
// }

// Generate JWT
const generateToken = (id: string): any => {
  return jwt.sign({ id }, secret, {
    expiresIn: "30d",
  });
};
