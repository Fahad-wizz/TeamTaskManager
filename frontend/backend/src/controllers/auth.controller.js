import { User } from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { signToken } from "../utils/tokens.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function toAuthResponse(user) {
  return {
    token: signToken(user),
    user: user.toJSON()
  };
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role: requestedRole = "member" } = req.validated.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const userCount = await User.countDocuments();
  const canCreateAdmin =
    requestedRole === "admin" &&
    (userCount === 0 || process.env.ALLOW_ADMIN_SIGNUP === "true");

  const user = await User.create({
    name,
    email,
    password,
    role: canCreateAdmin ? "admin" : "member"
  });

  res.status(201).json(toAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError(401, "Invalid email or password");
  }

  res.json(toAuthResponse(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
