import mongoose from "mongoose";

const uploadLogSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    uploadTime: {
      type: Date,
      default: Date.now
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    aiSummary: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["received", "processed", "emailed", "failed"],
      default: "received"
    }
  },
  {
    timestamps: true
  }
);

const UploadLog = mongoose.model("UploadLog", uploadLogSchema);

export default UploadLog;
