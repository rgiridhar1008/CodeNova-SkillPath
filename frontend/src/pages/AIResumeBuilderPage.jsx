import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  Save,
  ScanLine,
  Sparkles,
  Square,
} from "lucide-react";
import Layout from "../components/Layout";
import { askMentor } from "../api/client";

export default function AIResumeBuilderPage() {
  const [zoom, setZoom] = useState(75);
  const [template, setTemplate] = useState("Modern");
  const [fullScreen, setFullScreen] = useState(false);
  const [collapsed, setCollapsed] = useState({ personal: false, summary: false, experience: true });
  const [loadingAssist, setLoadingAssist] = useState(false);
  const [form, setForm] = useState({
    fullName: "Your Name",
    jobTitle: "Target Job Title",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    summary: "",
    experience: "",
  });

  const templates = ["Classic", "Modern", "Split", "Bold", "Minimal", "Compact", "Executive"];

  const previewSummary = useMemo(() => {
    if (form.summary.trim()) return form.summary.trim();
    return "Professional summary...";
  }, [form.summary]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const saveDraft = () => {
    localStorage.setItem("skillpath_resume_draft", JSON.stringify({ ...form, template, zoom }));
  };

  const exportPdf = () => {
    window.print();
  };

  const aiAssistSummary = async () => {
    try {
      setLoadingAssist(true);
      const prompt = `Write a concise ATS-friendly professional summary for this profile:
Name: ${form.fullName}
Target Job Title: ${form.jobTitle}
LinkedIn: ${form.linkedin || "N/A"}
GitHub: ${form.github || "N/A"}
Experience Notes: ${form.experience || "N/A"}
Output: 3-4 lines, professional tone, measurable impact style.`;
      const reply = await askMentor(prompt);
      updateField("summary", reply);
    } catch {
      updateField(
        "summary",
        "Results-oriented candidate with strong fundamentals, hands-on project delivery, and clear career focus."
      );
    } finally {
      setLoadingAssist(false);
    }
  };

  return (
    <Layout>
      <section className="grid gap-4 lg:grid-cols-12">
        <article className="glass-card rounded-3xl border border-white/40 p-4 lg:col-span-6 lg:p-5">
          <div className="flex items-center justify-between border-b border-white/35 pb-3">
            <p className="inline-flex items-center gap-2 font-heading text-3xl font-bold">
              <Square size={20} />
              Editor
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={saveDraft}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                <Save size={15} />
                Save
              </button>
              <button
                onClick={exportPdf}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
              >
                <ArrowDownToLine size={15} />
                Export PDF
              </button>
            </div>
          </div>

          <div className="mt-4 max-h-[72vh] space-y-4 overflow-auto pr-1">
            <div className="rounded-2xl border border-white/35 bg-white/50 p-4 dark:bg-white/5">
              <button
                onClick={() => setCollapsed((prev) => ({ ...prev, personal: !prev.personal }))}
                className="flex w-full items-center justify-between text-left font-heading text-xl font-semibold"
              >
                Personal Details
                {collapsed.personal ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              {!collapsed.personal && (
                <div className="mt-3 space-y-3">
                  <input
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-xl border border-slate-300/70 bg-white/85 px-3 py-2.5 dark:border-white/20 dark:bg-white/10"
                  />
                  <input
                    value={form.jobTitle}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder="Job Title"
                    className="w-full rounded-xl border border-slate-300/70 bg-white/85 px-3 py-2.5 dark:border-white/20 dark:bg-white/10"
                  />
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="Email"
                      className="w-full rounded-xl border border-slate-300/70 bg-white/85 px-3 py-2.5 dark:border-white/20 dark:bg-white/10"
                    />
                    <input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="Phone"
                      className="w-full rounded-xl border border-slate-300/70 bg-white/85 px-3 py-2.5 dark:border-white/20 dark:bg-white/10"
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={form.linkedin}
                      onChange={(e) => updateField("linkedin", e.target.value)}
                      placeholder="LinkedIn URL"
                      className="w-full rounded-xl border border-slate-300/70 bg-white/85 px-3 py-2.5 dark:border-white/20 dark:bg-white/10"
                    />
                    <input
                      value={form.github}
                      onChange={(e) => updateField("github", e.target.value)}
                      placeholder="GitHub URL"
                      className="w-full rounded-xl border border-slate-300/70 bg-white/85 px-3 py-2.5 dark:border-white/20 dark:bg-white/10"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/35 bg-white/50 p-4 dark:bg-white/5">
              <button
                onClick={() => setCollapsed((prev) => ({ ...prev, summary: !prev.summary }))}
                className="flex w-full items-center justify-between text-left font-heading text-xl font-semibold"
              >
                Summary
                {collapsed.summary ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              {!collapsed.summary && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-[var(--muted)]">Professional Summary</label>
                    <button
                      onClick={aiAssistSummary}
                      disabled={loadingAssist}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-70"
                    >
                      <Sparkles size={14} />
                      {loadingAssist ? "AI Writing..." : "AI Assist"}
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={form.summary}
                    onChange={(e) => updateField("summary", e.target.value)}
                    placeholder="Professional summary..."
                    className="w-full rounded-xl border border-slate-300/70 bg-white/85 px-3 py-2.5 dark:border-white/20 dark:bg-white/10"
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/35 bg-white/50 p-4 dark:bg-white/5">
              <button
                onClick={() => setCollapsed((prev) => ({ ...prev, experience: !prev.experience }))}
                className="flex w-full items-center justify-between text-left font-heading text-xl font-semibold"
              >
                Experience
                {collapsed.experience ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              {!collapsed.experience && (
                <textarea
                  rows={4}
                  value={form.experience}
                  onChange={(e) => updateField("experience", e.target.value)}
                  placeholder="Add recent experience/project impact points..."
                  className="mt-3 w-full rounded-xl border border-slate-300/70 bg-white/85 px-3 py-2.5 dark:border-white/20 dark:bg-white/10"
                />
              )}
            </div>
          </div>
        </article>

        <article className={`space-y-4 ${fullScreen ? "fixed inset-4 z-50 overflow-auto rounded-3xl bg-[var(--bg)] p-4" : "lg:col-span-6"}`}>
          <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/40 p-4">
            <div className="flex items-center gap-3">
              <p className="inline-flex items-center gap-2 font-heading text-3xl font-bold">
                <ScanLine size={20} />
                Live Preview
              </p>
              <div className="hidden h-6 w-px bg-slate-300/60 md:block" />
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom((z) => Math.max(50, z - 5))} className="rounded-lg border border-slate-300/60 px-2 py-1 dark:border-white/20">
                  <Minus size={14} />
                </button>
                <span className="min-w-14 text-center text-sm">{zoom}%</span>
                <button onClick={() => setZoom((z) => Math.min(120, z + 5))} className="rounded-lg border border-slate-300/60 px-2 py-1 dark:border-white/20">
                  <Plus size={14} />
                </button>
                <button onClick={() => setZoom(75)} className="rounded-lg border border-slate-300/60 px-2 py-1 text-sm dark:border-white/20">
                  Reset
                </button>
              </div>
            </div>
            <button onClick={() => setFullScreen((v) => !v)} className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">
              {fullScreen ? "Exit Full Screen" : "Full Screen"}
            </button>
          </div>

          <div className="glass-card rounded-2xl border border-white/40 p-4">
            <p className="font-heading text-xl font-semibold">Select Template</p>
            <div className="mt-3 flex gap-2 overflow-auto pb-1">
              {templates.map((item) => (
                <button
                  key={item}
                  onClick={() => setTemplate(item)}
                  className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold ${
                    template === item
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300/70 bg-white/65 hover:bg-white/90 dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/10"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card h-[64vh] overflow-auto rounded-2xl border border-white/40 p-4">
            <div
              className="mx-auto min-h-[520px] w-full max-w-[640px] rounded-xl bg-white p-8 text-slate-800 shadow-xl"
              style={{ zoom: `${zoom}%` }}
            >
              <header className="border-b pb-4 text-center">
                <h2 className="text-4xl font-extrabold">{form.fullName || "Your Name"}</h2>
                <p className="mt-1 text-2xl font-semibold text-cyan-700">{form.jobTitle || "Target Job Title"}</p>
                {(form.email || form.phone) && (
                  <p className="mt-2 text-sm text-slate-600">{[form.email, form.phone].filter(Boolean).join(" | ")}</p>
                )}
                {(form.linkedin || form.github) && (
                  <p className="mt-1 text-sm text-slate-600">{[form.linkedin, form.github].filter(Boolean).join(" | ")}</p>
                )}
              </header>

              <section className="mt-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Summary</p>
                <p className="mt-2 text-sm leading-relaxed">{previewSummary}</p>
              </section>

              {form.experience.trim() && (
                <section className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Experience</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{form.experience}</p>
                </section>
              )}
            </div>
          </div>
        </article>
      </section>
    </Layout>
  );
}
