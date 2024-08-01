import { transport } from "../config/nodemailer"

export class AuthEmail {
  static sendConfirmationEmail = async ({
    email,
    token,
    userName
  }: {
    email: string;
    token: string;
    userName: string;
  }) => {
    await transport.sendMail({
      from: "Uptask <admin@example.com>",
      to: email,
      subject: "Please confirm your email",
      text: "Please confirm your email",
      html: `<h1>Please confirm your email</h1>
            <p>Hola ${userName}, has creado tu cuenta en Uptask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
            <p>E ingresa el código de confirmación: <b>${token}</b></p>
            `,
    });
  };
}
