import { isDatabaseConnected } from "../config/database.js";

export const healthCheck = (req, res) => {
  void req;
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: String(process.env.SKIP_DB).toLowerCase() === "true" ? "memory" : isDatabaseConnected() ? "connected" : "unavailable",
      ai: process.env.AI_API_KEY && !process.env.AI_API_KEY.includes("your-") ? "configured" : "fallback",
      email: process.env.SMTP_HOST && !process.env.SMTP_HOST.includes("example.com") ? "configured" : "preview"
    }
  });
};
