import type { Request, Response } from "express"
import { AuthEmail } from "../emails/AuthEmail"
import Token from "../models/Token"
import User from "../models/User"
import { checkPassword, hasPassword } from "../utils/auth"
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

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        return res.status(401).json({ error: "Token not valid" });
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("User confirmed");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.token = generateToken();
        token.user = user.id;
        token.save();
        await AuthEmail.sendConfirmationEmail({
          email: user.email,
          token: token.token,
          userName: user.name,
        });
        return res.status(404).json({ error: "User not confirmed" });
      }

      const isPasswordValid = await checkPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Password not valid" });
      }

      res.send("Login success");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
