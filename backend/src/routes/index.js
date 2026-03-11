import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import emailRoutes from "./emailRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/upload", uploadRoutes);
router.use("/send-email", emailRoutes);

export default router;
