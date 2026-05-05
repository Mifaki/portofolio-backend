import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "@/config/variable";

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const OTP_TEMPLATE = path.join(process.cwd(), "src/templates/otp-email.ejs");

export async function sendOtpEmail(
  email: string,
  code: string,
  expiresInMinutes: number,
): Promise<void> {
  const html = await ejs.renderFile(OTP_TEMPLATE, { code, expiresInMinutes });

  await transport.sendMail({
    from: `"Faiz's Portfolio" <${SMTP_FROM}>`,
    to: email,
    subject: `${code} is your sign-in code`,
    text: `Your OTP code is: ${code}\n\nThis code expires in ${expiresInMinutes} minutes. Do not share it with anyone.`,
    html,
  });
}
