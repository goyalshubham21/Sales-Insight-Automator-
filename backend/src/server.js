import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/database.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  const shouldUseDatabase = String(process.env.SKIP_DB).toLowerCase() !== "true";

  if (shouldUseDatabase) {
    try {
      await connectDatabase();
      console.log("MongoDB connected");
    } catch (error) {
      console.warn("MongoDB unavailable, continuing in memory-only mode");
      console.warn(error.message);
      process.env.SKIP_DB = "true";
    }
  }

  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
