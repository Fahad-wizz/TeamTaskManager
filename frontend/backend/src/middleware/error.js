import { HttpError } from "../utils/httpError.js";

export function notFound(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, _req, res, _next) {
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with these values already exists" });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((issue) => issue.message)
      .join(", ");
    return res.status(400).json({ message });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Something went wrong" : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({ message });
}
