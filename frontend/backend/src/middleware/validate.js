import { ZodError } from "zod";
import { HttpError } from "../utils/httpError.js";

export function validate(schema) {
  return (req, _res, next) => {
    try {
      req.validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((issue) => issue.message).join(", ");
        next(new HttpError(400, message));
        return;
      }

      next(error);
    }
  };
}
