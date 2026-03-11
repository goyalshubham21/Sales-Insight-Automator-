import multer from "multer";

const allowedMimeTypes = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  void req;

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }

  callback(Object.assign(new Error("Only CSV and XLSX files are allowed"), { statusCode: 400 }));
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter
});
