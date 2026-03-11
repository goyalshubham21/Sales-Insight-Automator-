import UploadLog from "../models/UploadLog.js";

const memoryUploadLogs = new Map();

const isDatabaseEnabled = () => String(process.env.SKIP_DB).toLowerCase() !== "true";

const createMemoryId = () => `memory-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createUploadLog = async ({ fileName, email, status = "received", aiSummary = "" }) => {
  if (isDatabaseEnabled()) {
    return UploadLog.create({
      fileName,
      email,
      status,
      aiSummary
    });
  }

  const id = createMemoryId();
  const entry = {
    id,
    _id: id,
    fileName,
    email,
    status,
    aiSummary,
    uploadTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  memoryUploadLogs.set(id, entry);

  return entry;
};

export const updateUploadLog = async (id, payload) => {
  if (isDatabaseEnabled()) {
    return UploadLog.findByIdAndUpdate(id, payload, { new: true });
  }

  const currentEntry = memoryUploadLogs.get(id);

  if (!currentEntry) {
    return null;
  }

  const updatedEntry = {
    ...currentEntry,
    ...payload,
    updatedAt: new Date()
  };

  memoryUploadLogs.set(id, updatedEntry);

  return updatedEntry;
};
