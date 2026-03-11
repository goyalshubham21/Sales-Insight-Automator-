import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/UploadForm.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import ProgressTracker from "../components/ProgressTracker.jsx";
import { uploadSalesFile, sendSummaryEmail } from "../services/api.js";

const UploadPage = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("sent");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const progressIntervalRef = useRef(null);

  useEffect(
    () => () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    },
    []
  );

  const startProgressSimulation = (target) => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= target) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
          return current;
        }

        return Math.min(current + 4, target);
      });
    }, 140);
  };

  const handleSubmit = async ({ email, file }) => {
    try {
      setError("");
      setDeliveryMode("sent");
      setStatus("uploading");
      setProgress(12);
      startProgressSimulation(44);

      const uploadResponse = await uploadSalesFile({ email, file });

      setStatus("processing");
      setProgress((current) => Math.max(current, 58));
      startProgressSimulation(86);

      const emailResponse = await sendSummaryEmail({
        email,
        summary: uploadResponse.summary,
        uploadId: uploadResponse.uploadId
      });
      setDeliveryMode(emailResponse.deliveryMode || "sent");

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setProgress(100);
      setStatus("success");
      navigate("/success", {
        state: {
          email,
          summary: uploadResponse.summary,
          dataPreview: uploadResponse.dataPreview,
          deliveryMode: emailResponse.deliveryMode || "sent"
        }
      });
    } catch (requestError) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      setStatus("error");
      setProgress(100);
      setError(requestError.response?.data?.message || "The upload could not be completed.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">Sales Insight Automator</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Executive sales reporting from raw spreadsheet uploads
            </h1>
          </div>
          <div className="grid gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            <span className="font-medium">Workflow</span>
            <span>Upload to Analyze to Email</span>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 shadow-2xl shadow-slate-950/30">
            <div className="grid gap-10 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
              <div className="space-y-8">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-sm text-sky-200">
                    <span className="h-2 w-2 rounded-full bg-sky-300" />
                    AI executive briefing pipeline
                  </div>
                  <div className="space-y-4">
                    <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                      Turn sales exports into a boardroom-ready summary in minutes.
                    </h2>
                    <p className="max-w-xl text-base leading-7 text-slate-300">
                      Upload a CSV or Excel file, let the system extract the relevant sales signals, and send a concise
                      AI-generated summary directly to your stakeholder inbox.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Accepted formats</p>
                    <p className="mt-3 text-2xl font-semibold text-white">CSV, XLSX</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Processing target</p>
                    <p className="mt-3 text-2xl font-semibold text-white">Executive summary</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Delivery channel</p>
                    <p className="mt-3 text-2xl font-semibold text-white">SMTP email</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white px-5 py-5 text-slate-900 shadow-2xl shadow-slate-950/30">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">New Analysis</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">Upload sales dataset</h3>
                  </div>
                  <StatusBadge status={status} />
                </div>

                <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  Recommended input: transaction date, region, product category, revenue, units sold.
                </div>

                {deliveryMode === "preview" ? (
                  <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    SMTP is not configured, so this build shows a delivery preview instead of sending a real email.
                  </div>
                ) : null}

                <div className="mb-6">
                  <ProgressTracker progress={progress} status={status} />
                </div>

                <UploadForm onSubmit={handleSubmit} status={status} />

                {error ? (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <aside className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Operational Snapshot</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Parsing</p>
                  <p className="mt-2 text-lg font-semibold text-white">CSV and Excel normalization</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">AI brief</p>
                  <p className="mt-2 text-lg font-semibold text-white">Revenue trends, leaders, anomalies, actions</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Audit trail</p>
                  <p className="mt-2 text-lg font-semibold text-white">MongoDB when available, in-memory fallback otherwise</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-sky-400/20 bg-gradient-to-br from-sky-400/15 to-cyan-300/10 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">What gets delivered</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
                <li>Revenue direction and notable movement</li>
                <li>Best-performing region and product category</li>
                <li>Potential anomalies from the uploaded records</li>
                <li>Strategic recommendations for leadership</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default UploadPage;
