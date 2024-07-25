import type { Request, Response } from "express"
import { AuthEmail } from "../emails/AuthEmail"
import Token from "../models/Token"
import User from "../models/User"
import { hasPassword } from "../utils/auth"
import { generateToken } from "../utils/token"

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(409).json({ error: "User already exists" });
      }

      const user = new User(req.body);
      user.password = await hasPassword(password);

      //Generate token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      await AuthEmail.sendConfirmationEmail({
        email: user.email,
        token: token.token,
        userName: user.name,
      });
      await Promise.allSettled([user.save(), token.save()]);
      res.send("User created");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
