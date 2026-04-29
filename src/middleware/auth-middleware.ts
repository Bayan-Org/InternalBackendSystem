import type { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt-util.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        statusCode: 401,
        message: "Token is missing",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: "Wrong token format",
      });
    }

    const decoded = await verifyJwt(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
      data: error,
    });
  }
};
