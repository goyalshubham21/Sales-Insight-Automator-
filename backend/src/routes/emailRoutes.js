import { Router } from "express";
import { sendSummaryEmail } from "../controllers/emailController.js";
import { validateEmailBody } from "../middleware/validateRequest.js";

const router = Router();

/**
 * @swagger
 * /api/send-email:
 *   post:
 *     summary: Send AI-generated summary email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - summary
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               summary:
 *                 type: string
 *               uploadId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email sent
 */
router.post("/", validateEmailBody, sendSummaryEmail);

export default router;
