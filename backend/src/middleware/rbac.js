import { HttpError } from "../utils/httpError.js";

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new HttpError(403, "You do not have permission to perform this action");
    }

    next();
  };
}
