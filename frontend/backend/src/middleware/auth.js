import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new HttpError(401, "Authentication token required");
  }

  const token = header.split(" ")[1];
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }

  const user = await User.findById(payload.sub).select("-password");

  if (!user) {
    throw new HttpError(401, "User no longer exists");
  }

  req.user = user;
  next();
});
