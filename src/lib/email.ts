import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.log("Email .env files not present");
    return;
  }
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;
  const transpoter = nodemailer.createTransport({
    port,
    host,
    secure: false,
    auth: {
      user,
      pass,
    },
  });
  await transpoter.sendMail({
    from,
    to,
    subject,
    html,
  });
}
