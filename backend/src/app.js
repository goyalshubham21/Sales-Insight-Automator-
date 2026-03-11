import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { corsOptions } from "./config/cors.js";
import { swaggerSpec } from "./config/swagger.js";
import apiRoutes from "./routes/index.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, "../../frontend/dist");

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use("/api", apiLimiter, apiRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static(frontendDistPath));
app.get(/^\/(?!api(?:\/|$)|api-docs(?:\/|$)).*/, (req, res, next) => {
  res.sendFile(path.join(frontendDistPath, "index.html"), (error) => {
    if (error) {
      next();
    }
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
