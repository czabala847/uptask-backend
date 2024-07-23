import type { Request, Response } from "express"

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    console.log({ req, res });

    try {
      res.send("Account created");
    } catch (error) {
      console.error(error);
    }
  };
}
