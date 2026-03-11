import { useState } from "react";

const allowedExtensions = [".csv", ".xlsx"];

const UploadForm = ({ onSubmit, status }) => {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const validateFile = (selectedFile) => {
    if (!selectedFile) {
      return "Please select a file.";
    }

    const lowerName = selectedFile.name.toLowerCase();
    const isValid = allowedExtensions.some((extension) => lowerName.endsWith(extension));

    if (!isValid) {
      return "Only .csv and .xlsx files are allowed.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationMessage = validateFile(file);

    if (validationMessage) {
      setLocalError(validationMessage);
      return;
    }

    setLocalError("");
    await onSubmit({ email, file });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Executive Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="executive@company.com"
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Sales File</span>
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          required
          className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-slate-600 shadow-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-slate-700"
        />
      </label>

      {localError ? <p className="text-sm font-medium text-rose-600">{localError}</p> : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-500"
        disabled={status === "uploading" || status === "processing"}
      >
        {status === "uploading" || status === "processing" ? "Working..." : "Upload and Analyze"}
      </button>
    </form>
  );
};

export default UploadForm;
