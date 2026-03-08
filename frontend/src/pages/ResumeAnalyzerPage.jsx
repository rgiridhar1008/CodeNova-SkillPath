import { useState } from "react";
import { CheckCircle2, FileText } from "lucide-react";
import Layout from "../components/Layout";
import { analyzeResume } from "../api/client";

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const runAnalysis = async (file) => {
    setLoading(true);
    try {
      const data = await analyzeResume(file);
      const text = data.resumeText || "";
      setResumeText(text);
      setReport({
        score: data.resumeScore,
        hits: data.extractedSkills || [],
        missing: data.missingSkillsVsIndustry || [],
        grammarTips: data.tips || [
          "Use action verbs in bullet points.",
          "Quantify impact with numbers.",
          "Keep tense consistent across experiences."
        ],
        checklist: ["Clear summary", "Project links", "Skills section", "Role-focused keywords"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Resume Analyzer</h1>
          <p className="text-sm text-[var(--muted)]">
            ATS compatibility, keyword optimization, and section-level improvement checklist.
          </p>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2 text-white">
            <FileText size={16} />
            {loading ? "Analyzing..." : "Upload Resume PDF"}
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) runAnalysis(file);
              }}
            />
          </label>
        </div>

        {report && (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="glass-card rounded-3xl p-6">
              <p className="font-heading text-xl font-semibold">Resume Score</p>
              <p className="mt-3 font-heading text-5xl font-bold">{report.score}/100</p>
              <p className="text-sm text-[var(--muted)]">ATS compatibility + keyword quality</p>
            </div>
            <div className="glass-card rounded-3xl p-6 lg:col-span-2">
              <p className="font-heading text-lg font-semibold">Keyword Optimization</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {report.hits.map((k) => (
                  <span key={k} className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs">{k}</span>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold">Missing Important Keywords</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {report.missing.map((k) => (
                  <span key={k} className="rounded-full bg-amber-500/20 px-3 py-1 text-xs">{k}</span>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-3xl p-6 lg:col-span-3">
              <p className="font-heading text-lg font-semibold">Improvement Checklist</p>
              <ul className="mt-2 space-y-2 text-sm">
                {report.checklist.map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold">Grammar Suggestions</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
                {report.grammarTips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {resumeText && (
          <div className="glass-card rounded-3xl p-6">
            <p className="font-heading text-lg font-semibold">Extracted Resume Preview</p>
            <p className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap text-sm text-[var(--muted)]">
              {resumeText.slice(0, 1800)}
            </p>
          </div>
        )}
      </section>
    </Layout>
  );
}
