import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Please login - auth header missing or invalid",
      });
      return;
    }
    const jwtSecret = process.env.JWT_SECRET;
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({
        message: "token not found in header",
      });
    }
    const decodedValue = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decodedValue || !decodedValue.user) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    req.user = decodedValue.user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Please login - JWT error",
    });
  }
};

export default isAuth;
