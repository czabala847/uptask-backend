import { transport } from "../config/nodemailer"

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async ({
    email,
    token,
    userName,
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

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transport.sendMail({
      from: "UpTask <admin@uptask.com>",
      to: user.email,
      subject: "UpTask - Reestablece tu password",
      text: "UpTask - Reestablece tu password",
      html: `<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
            <p>Visita el siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
        `,
    });

    console.log("Mensaje enviado", info.messageId);
  };
}
