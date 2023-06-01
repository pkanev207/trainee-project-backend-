// import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user-model.js";
import env from "../util/validate-env.js";

const secret = env.JWT_SECRET;
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
        console.error(error);
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

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req?.user?.role !== "admin") {
    res.status(403);
    throw new Error("The client does not have access rights");
  } else {
    next();
  }
});
