import { parseSalesFile } from "../services/fileParserService.js";
import { generateSalesSummary } from "../services/aiService.js";
import { createUploadLog, updateUploadLog } from "../services/uploadLogService.js";
import { createHttpError } from "../utils/httpError.js";

export const uploadSalesFile = async (req, res, next) => {
  let logEntry;

  try {
    if (!req.file) {
      throw createHttpError(400, "File is required");
    }

    const { email } = req.body;

    logEntry = await createUploadLog({
      fileName: req.file.originalname,
      email
    });

    const rows = await parseSalesFile(req.file);
    const summary = await generateSalesSummary(rows);

    await updateUploadLog(logEntry.id, {
      aiSummary: summary,
      status: "processed"
    });

    res.status(200).json({
      message: "File processed successfully",
      summary,
      dataPreview: rows.slice(0, 10),
      uploadId: logEntry.id
    });
  } catch (error) {
    if (logEntry?.id) {
      await updateUploadLog(logEntry.id, { status: "failed" });
    }

    next(error);
  }
};
