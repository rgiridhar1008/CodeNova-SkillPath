import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function SavedReportsPage() {
  const navigate = useNavigate();
  const reports = useMemo(() => {
    const current = localStorage.getItem("skillpath_result");
    if (!current) return [];
    return [{ id: "latest", label: "Latest Analysis", payload: JSON.parse(current) }];
  }, []);

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Saved Reports</h1>
          <p className="text-sm text-[var(--muted)]">
            Access previous analyses and reopen dashboards instantly.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="glass-card rounded-3xl p-6">
            <p className="text-sm text-[var(--muted)]">No saved reports yet. Run an analysis first.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {reports.map((report) => (
              <article key={report.id} className="glass-card rounded-3xl p-5">
                <p className="font-heading text-lg font-semibold">{report.label}</p>
                <p className="text-sm text-[var(--muted)]">
                  Career: {report.payload.analysis?.career} • Match: {report.payload.analysis?.skillMatchPercentage}%
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard", { state: report.payload })}
                  className="mt-3 rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
                >
                  Open Dashboard
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
