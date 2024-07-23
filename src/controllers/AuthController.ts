import type { Request, Response } from "express"
import User from "../models/User"
import { hasPassword } from "../utils/auth"

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const user = new User(req.body);
      user.password = await hasPassword(password);
      await user.save();
      res.send("User created");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
