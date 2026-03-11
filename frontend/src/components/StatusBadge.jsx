const stateMap = {
  idle: "Idle",
  uploading: "Uploading",
  processing: "Processing AI summary",
  success: "Success",
  error: "Error"
};

const styles = {
  idle: "border-slate-200 bg-slate-100 text-slate-700",
  uploading: "border-amber-200 bg-amber-50 text-amber-700",
  processing: "border-sky-200 bg-sky-50 text-sky-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700"
};

const StatusBadge = ({ status }) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${styles[status] || styles.idle}`}
  >
    <span className="h-2 w-2 rounded-full bg-current opacity-80" />
    {stateMap[status] || "Idle"}
  </div>
);

export default StatusBadge;
