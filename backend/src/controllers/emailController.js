import { sendSalesSummaryEmail } from "../services/emailService.js";
import { updateUploadLog } from "../services/uploadLogService.js";

export const sendSummaryEmail = async (req, res, next) => {
  try {
    const { email, summary, uploadId } = req.body;

    const emailResult = await sendSalesSummaryEmail({ email, summary });

    if (uploadId) {
      await updateUploadLog(uploadId, {
        status: emailResult.mode === "sent" ? "emailed" : "processed"
      });
    }

    res.status(200).json({
      message: emailResult.mode === "sent" ? "Summary emailed successfully" : "Email delivery skipped; preview mode active",
      deliveryMode: emailResult.mode
    });
  } catch (error) {
    next(error);
  }
};
