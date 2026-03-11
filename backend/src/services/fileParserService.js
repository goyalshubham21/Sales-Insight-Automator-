import csvParser from "csv-parser";
import xlsx from "xlsx";
import { Readable } from "stream";
import { createHttpError } from "../utils/httpError.js";

const parseCsvBuffer = async (buffer) =>
  new Promise((resolve, reject) => {
    const rows = [];
    Readable.from([buffer])
      .pipe(csvParser())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });

const parseExcelBuffer = (buffer) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const firstSheet = workbook.SheetNames[0];

  if (!firstSheet) {
    throw createHttpError(400, "Excel file does not contain any sheets");
  }

  return xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" });
};

export const parseSalesFile = async (file) => {
  if (!file) {
    throw createHttpError(400, "File is required");
  }

  const extension = file.originalname.split(".").pop()?.toLowerCase();

  if (extension === "csv") {
    return parseCsvBuffer(file.buffer);
  }

  if (extension === "xlsx") {
    return parseExcelBuffer(file.buffer);
  }

  throw createHttpError(400, "Unsupported file format");
};
