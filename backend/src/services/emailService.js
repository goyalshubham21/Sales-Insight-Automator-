import nodemailer from "nodemailer";
import { createHttpError } from "../utils/httpError.js";

const hasEmailConfig = () => {
  const requiredValues = [
    process.env.SMTP_HOST,
    process.env.SMTP_USER,
    process.env.SMTP_PASS
  ];

  return requiredValues.every(
    (value) => value && !value.includes("example.com") && !value.includes("your_smtp_") && !value.includes("your-smtp-")
  );
};

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

export const sendSalesSummaryEmail = async ({ email, summary }) => {
  if (!hasEmailConfig()) {
    return {
      messageId: `preview-${Date.now()}`,
      mode: "preview",
      accepted: [email]
    };
  }

  const transporter = createTransporter();

  const result = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "AI Generated Sales Summary",
    text: summary
  });

  if (!result.messageId) {
    throw createHttpError(502, "Failed to send email");
  }

  return {
    ...result,
    mode: "sent"
  };
};
