import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
// import { User } from "../models/user-model.js";
import User from "../models/user-model.js";
import env from "../util/validate-env.js";
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
  if (password === null || password === undefined) {
    throw new Error("Unexpected error: Password is missing");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await User.create({ name, email, password: hashedPassword });
  if (user.email !== "") {
    const token = generateToken(user._id as any);
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
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
    if (
      email === null ||
      email === undefined ||
      password === null ||
      password === undefined
    ) {
      res.status(400);
      throw new Error("Please provide email and password");
    }
    // check for user email
    const user = await User.findOne({ email }).select("+email +password");
    if (user == null) {
      res.status(400);
      throw new Error("Invalid user");
    }

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

// @route POST/api/users/logout
export const logout: RequestHandler = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Successful logout",
  });
  // On the client side, delete the cookie from the browser.
  // On the server side, set the cookie value to an empty string and set the cookie expiration time to a time in the past.
  // On the server side, update the refreshtoken stored in your database.
  // Use this option to log out the user from all devices where they are logged in.
});

// @route GET/api/users/user
export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
  //   const { _id, name, email } = await User.findById(req.user.id);
  //   res.status(200).json({ id: _id, name, email });
});

// @route POST/api/users/update
export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  const newData = { name: req.body.name, email: req.body.email };
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json(user);
});

// @route PUT/api/users/password/update
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select("+password");
  if (user === undefined || user === null) {
    res.status(400);
    throw new Error("No such user");
  }

  const isCorrectOldPassword = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!isCorrectOldPassword) {
    res.status(400);
    throw new Error("Old password is incorrect");
  }

  user.password = await bcrypt.hash(req.body.newPassword, 10);
  await user.save();

  cookieToken(user, res);
});

// @route GET/api/users/forgotpassword
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // const { email } = req.body;
  // const user = await User.findOne({ email });
  // if (!user) {
  //   res.status(400);
  //   throw new Error("Invalid user data");
  // }
  // const forgotToken = user.getForgotPasswordToken();
  // console.log(forgotToken);
  // user.save({ validateBeforeSave: false });
  // const myUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/password/reset/${forgotToken}`;
  // const message = `Copy paste this link in your URL and hit enter \n\n  ${myUrl}`;
  // try {
  //   await mailHelper({
  //     email: "test1@gmail.com",
  //     // email: "petarkamenovkanev@gmail.com",
  //     subject: "CLP - Password reset email",
  //     message,
  //   });
  //   res.status(200).json({
  //     success: true,
  //     message: "Email sent successfully",
  //   });
  // } catch (error) {
  //   console.log(error.message);
  //   user.forgotPasswordToken = undefined;
  //   user.forgotPasswordExpiry = undefined;
  //   await user.save({ ValidityState: false });
  //   // return next(new Error(error.message));
  //   res.status(501);
  //   throw new Error(error.message);
  // }
});

// @route POST/api/users/forgotpassword/reset/:token
export const resetPassword = asyncHandler(async (req, res) => {});

// @route GET/api/users/admin/users
export const adminAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.status(200).json({ users });
});

// @route DEL/api/users/admin/user/:id
export const adminDeleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user === undefined || user === null) {
    res.status(401);
    throw new Error("No such user found");
  }

  res.status(200).json({ message: "User deleted" });
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

// sending response
const cookieToken = (user: any, res: any): void => {
  const token = generateToken(user._id);
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_TIME as any) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(200)
    .cookie("token", token, options)
    .json({ success: true, token, user });
};
