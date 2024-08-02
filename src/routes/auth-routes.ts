import { Router } from "express"
import { body, param } from "express-validator"
import { AuthController } from "../controllers/AuthController"
import { handleInputError } from "../middleware/validation"

const router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("password_confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(
        `Las contraseñas no coinciden ${value} - ${req.body.password}`
      );
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

router.post(
  "/login",
  body("email").isEmail().withMessage("El email es obligatorio"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputError,
  AuthController.login
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("E-mail no válido"),
  handleInputError,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("E-mail no válido"),
  handleInputError,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El Token no puede ir vacio"),
  handleInputError,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("Token no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Los Password no son iguales");
    }
    return true;
  }),
  handleInputError,
  AuthController.updatePasswordWithToken
);

export default router;
