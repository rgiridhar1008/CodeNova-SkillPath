import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, UserPlus } from "lucide-react";
import Layout from "../components/Layout";
import { addStudent, getStudents, removeStudent } from "../api/client";

export default function CommunityPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [xp, setXp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStudents = async (query = "") => {
    try {
      const data = await getStudents(query);
      setStudents(data);
    } catch {
      setStudents([]);
      setError("Unable to load students.");
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const rankedStudents = useMemo(
    () => students.map((student, index) => ({ ...student, rank: index + 1 })),
    [students]
  );

  return (
    <Layout>
      <section className="space-y-4">
        <div className="glass-card rounded-3xl p-6">
          <h1 className="font-heading text-3xl font-bold">Leaderboard</h1>
          <p className="text-sm text-[var(--muted)]">
            Manage student leaderboard: search by name/roll number, add students, and remove entries.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="glass-card rounded-3xl p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="font-heading text-xl font-semibold">Students List</p>
              <div className="relative w-full max-w-sm">
                <Search size={16} className="pointer-events-none absolute left-3 top-3.5 text-[var(--muted)]" />
                <input
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    loadStudents(value);
                  }}
                  placeholder="Search name or roll number"
                  className="w-full rounded-xl border border-white/30 bg-white/75 py-2.5 pl-9 pr-3 text-sm dark:bg-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              {rankedStudents.map((student) => (
                <div
                  key={student.id || `${student.rollNumber}-${student.name}`}
                  className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-sm dark:bg-white/10"
                >
                  <div>
                    <p className="font-medium">
                      {student.rank}. {student.name}
                    </p>
                    <p className="text-xs text-[var(--muted)]">Roll No: {student.rollNumber || "-"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{student.xp || 0} XP</span>
                    {student.id && (
                      <button
                        onClick={async () => {
                          await removeStudent(student.id);
                          await loadStudents(search);
                        }}
                        className="rounded-lg bg-red-500/10 p-2 text-red-600 transition hover:bg-red-500/20 dark:text-red-300"
                        title="Delete student"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!rankedStudents.length && (
                <p className="rounded-xl bg-white/55 px-3 py-2 text-sm text-[var(--muted)] dark:bg-white/10">
                  No students found.
                </p>
              )}
            </div>
          </article>

          <article className="glass-card rounded-3xl p-6">
            <p className="font-heading text-xl font-semibold">Add Student</p>
            <div className="mt-3 rounded-xl border border-white/25 bg-white/50 p-3 dark:bg-white/10">
              <div className="space-y-2">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Student name"
                  className="w-full rounded-lg border border-white/30 bg-white/75 px-3 py-2 text-sm dark:bg-white/10"
                />
                <input
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Roll number"
                  className="w-full rounded-lg border border-white/30 bg-white/75 px-3 py-2 text-sm dark:bg-white/10"
                />
                <input
                  type="number"
                  min="0"
                  value={xp}
                  onChange={(e) => setXp(e.target.value)}
                  placeholder="XP (optional)"
                  className="w-full rounded-lg border border-white/30 bg-white/75 px-3 py-2 text-sm dark:bg-white/10"
                />
              </div>

              {error && <p className="mt-2 text-xs text-red-600 dark:text-red-300">{error}</p>}
              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setError("");
                  if (!name.trim() || !rollNumber.trim()) {
                    setError("Name and roll number are required.");
                    return;
                  }
                  try {
                    setLoading(true);
                    await addStudent({
                      name: name.trim(),
                      rollNumber: rollNumber.trim(),
                      xp: xp ? Number(xp) : 0,
                    });
                    setName("");
                    setRollNumber("");
                    setXp("");
                    await loadStudents(search);
                  } catch (e) {
                    setError(e?.response?.data?.error || "Unable to add student.");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-70"
              >
                <UserPlus size={14} />
                {loading ? "Adding..." : "Add Student"}
              </button>
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}
