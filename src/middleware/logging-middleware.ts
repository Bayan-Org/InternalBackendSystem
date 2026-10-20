import type { NextFunction, Request, Response } from "express";

export const LoggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Path:", req.originalUrl);
  console.log("Method:", req.method);

  next();
};
