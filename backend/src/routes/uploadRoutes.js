import { Router } from "express";
import { uploadSalesFile } from "../controllers/uploadController.js";
import { uploadMiddleware } from "../middleware/upload.js";
import { validateUploadBody } from "../middleware/validateRequest.js";

const router = Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload and analyze a sales file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - file
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Summary generated
 */
router.post("/", uploadMiddleware.single("file"), validateUploadBody, uploadSalesFile);

export default router;
