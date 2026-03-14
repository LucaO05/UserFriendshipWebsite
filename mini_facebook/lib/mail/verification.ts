import nodemailer from "nodemailer";
import {ApiError} from "@/lib/api/errors";

export async function sendVerificationCodeEmail(email: string, code: string) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !from || !user || !pass) {
    console.info(`Verification code for ${email}: ${code}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: {
        user,
        pass: pass.replace(/\s+/g, ""),
      },
    });

    await transporter.sendMail({
      from,
      to: email,
      subject: "Dein Verifizierungscode",
      text: `Dein Code lautet: ${code}`,
      html: `<p>Dein Verifizierungscode lautet: <strong>${code}</strong></p>`,
    });
  } catch (error) {
    console.error("SMTP-Versand fehlgeschlagen:", error);
    throw new ApiError(
      "E-Mail-Versand fehlgeschlagen. Prüfe SMTP_USER/SMTP_PASS (bei Gmail App-Passwort).",
      502,
      {requiresVerification: true, email},
    );
  }
}
