import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const searchUsers = asyncHandler(async (req, res) => {
  const q = String(req.query.q || "").trim();
  const filter = q
    ? {
        $or: [
          { name: { $regex: escapeRegex(q), $options: "i" } },
          { email: { $regex: escapeRegex(q), $options: "i" } }
        ]
      }
    : {};

  const users = await User.find(filter)
    .select("name email role")
    .sort({ name: 1 })
    .limit(30);

  res.json({ users });
});
