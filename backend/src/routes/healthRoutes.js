import { Router } from "express";
import { healthCheck } from "../controllers/healthController.js";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/", healthCheck);

export default router;
