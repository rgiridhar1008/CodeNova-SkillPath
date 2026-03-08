import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Layout from "../components/Layout";
import { profileReferences } from "../data/dashboardFeatures";

const PROFILE_KEY = "skillpath_profile";

export default function ProfilePage() {
  const username = localStorage.getItem("skillpath_username") || "abc";

  const initialProfile = useMemo(() => {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const normalizedRefs = (parsed.savedReferences || []).map((item) =>
          typeof item === "string" ? { label: item, url: "" } : item
        );
        return { ...parsed, savedReferences: normalizedRefs };
      } catch {
        // fall through to defaults
      }
    }
    return {
      personalInfo: {
        fullName: username,
        email: "",
        phone: "",
        location: "",
      },
      skillsProgress: "Python (Intermediate), SQL (Intermediate), React (Beginner)",
      learningHistory: "Completed roadmap weeks 1-4. Built one mini project.",
      savedReferences: profileReferences,
      careerInterests: ["Data Scientist", "AI Engineer"],
    };
  }, [username]);

  const [profile, setProfile] = useState(initialProfile);
  const [refLabelInput, setRefLabelInput] = useState("");
  const [refUrlInput, setRefUrlInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const saveProfile = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSavedMsg("Profile updated successfully.");
    setTimeout(() => setSavedMsg(""), 1800);
  };

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl font-bold">My Profile</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Personalized learning and career profile for {username}.
              </p>
            </div>
            <button
              onClick={saveProfile}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
          {savedMsg && <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-300">{savedMsg}</p>}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="glass-card rounded-3xl p-6">
            <p className="font-heading text-lg font-semibold">Personal Info</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <input
                value={profile.personalInfo.fullName}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                  }))
                }
                placeholder="Full Name"
                className="rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              />
              <input
                value={profile.personalInfo.email}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value },
                  }))
                }
                placeholder="Email"
                className="rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              />
              <input
                value={profile.personalInfo.phone}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value },
                  }))
                }
                placeholder="Phone"
                className="rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              />
              <input
                value={profile.personalInfo.location}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value },
                  }))
                }
                placeholder="Location"
                className="rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              />
            </div>

            <p className="mt-5 font-heading text-lg font-semibold">Skills Progress</p>
            <textarea
              value={profile.skillsProgress}
              onChange={(e) => setProfile((prev) => ({ ...prev, skillsProgress: e.target.value }))}
              rows={3}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              placeholder="Add skill levels..."
            />

            <p className="mt-5 font-heading text-lg font-semibold">Learning History</p>
            <textarea
              value={profile.learningHistory}
              onChange={(e) => setProfile((prev) => ({ ...prev, learningHistory: e.target.value }))}
              rows={4}
              className="mt-2 w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              placeholder="Add your learning milestones..."
            />
          </article>

          <article className="glass-card rounded-3xl p-6">
            <p className="font-heading text-lg font-semibold">Saved References</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                value={refLabelInput}
                onChange={(e) => setRefLabelInput(e.target.value)}
                placeholder="Reference title"
                className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              />
              <input
                value={refUrlInput}
                onChange={(e) => setRefUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              />
              <button
                onClick={() => {
                  const label = refLabelInput.trim();
                  const url = refUrlInput.trim();
                  if (!label) return;
                  setProfile((prev) => ({
                    ...prev,
                    savedReferences: prev.savedReferences.concat({ label, url }),
                  }));
                  setRefLabelInput("");
                  setRefUrlInput("");
                }}
                className="rounded-xl bg-[var(--brand)] px-3 py-2 text-white"
              >
                <Plus size={16} />
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {profile.savedReferences.map((item, idx) => (
                <li key={`${item.label || "ref"}-${idx}`} className="flex items-center justify-between rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                  <div className="w-full space-y-1">
                    <input
                      value={item.label || ""}
                      onChange={(e) => {
                        const next = [...profile.savedReferences];
                        next[idx] = { ...next[idx], label: e.target.value };
                        setProfile((prev) => ({ ...prev, savedReferences: next }));
                      }}
                      className="w-full bg-transparent font-medium outline-none"
                    />
                    <input
                      value={item.url || ""}
                      onChange={(e) => {
                        const next = [...profile.savedReferences];
                        next[idx] = { ...next[idx], url: e.target.value };
                        setProfile((prev) => ({ ...prev, savedReferences: next }));
                      }}
                      placeholder="Paste URL (optional)"
                      className="w-full bg-transparent text-xs text-[var(--muted)] outline-none"
                    />
                    {item.url && (
                      <a
                        href={item.url.startsWith("http") ? item.url : `https://${item.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-400"
                      >
                        Open link
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        savedReferences: prev.savedReferences.filter((_, i) => i !== idx),
                      }))
                    }
                    className="ml-2 rounded-lg p-1 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <p className="mt-5 font-heading text-lg font-semibold">Career Interests</p>
            <div className="mt-3 flex gap-2">
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="Add career interest"
                className="w-full rounded-xl border border-white/30 bg-white/70 px-3 py-2 text-sm dark:bg-white/10"
              />
              <button
                onClick={() => {
                  const value = interestInput.trim();
                  if (!value) return;
                  setProfile((prev) => ({ ...prev, careerInterests: prev.careerInterests.concat(value) }));
                  setInterestInput("");
                }}
                className="rounded-xl bg-[var(--brand)] px-3 py-2 text-white"
              >
                <Plus size={16} />
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {profile.careerInterests.map((item, idx) => (
                <li key={`${item}-${idx}`} className="flex items-center justify-between rounded-xl bg-white/55 px-3 py-2 dark:bg-white/10">
                  <input
                    value={item}
                    onChange={(e) => {
                      const next = [...profile.careerInterests];
                      next[idx] = e.target.value;
                      setProfile((prev) => ({ ...prev, careerInterests: next }));
                    }}
                    className="w-full bg-transparent outline-none"
                  />
                  <button
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        careerInterests: prev.careerInterests.filter((_, i) => i !== idx),
                      }))
                    }
                    className="ml-2 rounded-lg p-1 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </Layout>
  );
}
