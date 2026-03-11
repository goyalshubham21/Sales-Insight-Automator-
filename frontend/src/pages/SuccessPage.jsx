import { Link, useLocation, Navigate } from "react-router-dom";

const SuccessPage = () => {
  const { state } = useLocation();

  if (!state?.summary) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <section className="space-y-6">
          <div className="success-hero relative overflow-hidden rounded-[2rem] border border-emerald-400/20 bg-gradient-to-r from-emerald-500/15 to-sky-500/10 p-6">
            <div className="success-glow" />
            <div className="success-check mb-5">
              <div className="success-check-ring" />
              <svg viewBox="0 0 52 52" className="success-check-icon" aria-hidden="true">
                <circle className="success-check-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="success-check-path" fill="none" d="M14 27l7 7 17-17" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">Delivery Complete</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">
              Executive summary generated {state.deliveryMode === "preview" ? "and prepared for preview." : "and emailed."}
            </h1>
            <p className="mt-3 text-slate-300">Recipient: {state.email}</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-slate-950/25">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Summary Preview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">AI-generated briefing</h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    state.deliveryMode === "preview"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {state.deliveryMode === "preview" ? "Preview only" : "Sent"}
                </span>
              </div>

              {state.deliveryMode === "preview" ? (
                <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  This deployment is running without SMTP credentials. The summary is shown here for review, but no email was sent.
                </div>
              ) : null}

              <pre className="rounded-3xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">{state.summary}</pre>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Parsed Data Preview</p>
                <pre className="mt-4 max-h-[420px] overflow-auto rounded-3xl border border-white/10 bg-slate-900 p-4 text-xs leading-6 text-slate-200">
                  {JSON.stringify(state.dataPreview, null, 2)}
                </pre>
              </div>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-slate-100"
              >
                Analyze another file
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SuccessPage;
