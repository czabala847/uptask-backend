import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bearer = req.headers.authorization;

    if (!bearer) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [_, token] = bearer.split(" ");

    try {
      const decode = jwt.verify(
        token,
        process.env.JWT_SECRET
      ) as jwt.JwtPayload;

      if (typeof decode === "object" && typeof decode.id === "string") {
        const user = await User.findById(decode.id).select("_id name email");
        if (user) {
          req.user = user;
          next();
        } else {
          res.status(401).json({ error: "Unauthorized" });
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
