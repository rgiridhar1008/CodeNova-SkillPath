const ONBOARDING_KEY = "skillpath_onboarding";
const TASKS_KEY = "skillpath_daily_tasks";

export function getOnboarding() {
  try {
    return JSON.parse(localStorage.getItem(ONBOARDING_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveOnboarding(payload) {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(payload));
}

export function clearOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(TASKS_KEY);
}

export function isOnboardingComplete() {
  const data = getOnboarding();
  return Boolean(data?.targetRole && data?.skills && data?.hoursPerWeek);
}

export function getDailyTasks() {
  try {
    const raw = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
    if (Array.isArray(raw) && raw.length) return raw;
  } catch {
    // fall through
  }
  return [
    { id: "task-1", title: "Complete one roadmap module", done: false },
    { id: "task-2", title: "Practice 2 interview questions", done: false },
    { id: "task-3", title: "Update resume with one impact bullet", done: false },
  ];
}

export function saveDailyTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}
