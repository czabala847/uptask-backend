import { Router } from "express"
import { body } from "express-validator"
import { AuthController } from "../controllers/AuthController"
import { handleInputError } from '../middleware/validation'

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("password_confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(`Las contraseñas no coinciden ${value} - ${req.body.password}`);
    }
    return true;
  }),
  body("email").isEmail().withMessage("El email es obligatorio"),
  handleInputError,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token es obligatorio"),
  handleInputError,
  AuthController.confirmAccount
);

export default router;
