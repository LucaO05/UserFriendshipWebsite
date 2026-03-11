import nodemailer from "nodemailer";

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

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Dein Verifizierungscode",
    text: `Dein Code lautet: ${code}`,
    html: `<p>Dein Verifizierungscode lautet: <strong>${code}</strong></p>`,
  });
}
