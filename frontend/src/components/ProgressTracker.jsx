const labels = {
  idle: "Ready for upload",
  uploading: "Uploading sales file",
  processing: "Generating AI summary",
  success: "Summary delivered",
  error: "Processing interrupted"
};

const ProgressTracker = ({ progress, status }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-slate-600">{labels[status] || labels.idle}</span>
      <span className="font-semibold text-slate-900">{progress}%</span>
    </div>
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
      <div
        className={`h-full rounded-full transition-[width,background-color] duration-500 ${
          status === "error"
            ? "bg-rose-500"
            : status === "success"
              ? "bg-emerald-500"
              : "bg-gradient-to-r from-sky-500 to-cyan-400"
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

export default ProgressTracker;
