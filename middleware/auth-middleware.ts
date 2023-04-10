import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/user-model.js";
// const secret = process.env.JWT_SECRET; // not working!
const secret = "traineeproject123";
// interface JwtPayload {
//   _id: string;
// }
export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req?.headers.authorization !== undefined &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];
        // Verify token
        const decoded = jwt.verify(token, secret) as any;
        // Get user from token
        req.user = await User.findById(decoded.id).select("-password");
        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");
      }
    }

    if (token === undefined) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);
