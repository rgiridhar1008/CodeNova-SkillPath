import axios from "axios";
import { withCache } from "../utils/cache";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
});

export async function uploadResume(file) {
  const form = new FormData();
  form.append("resume", file);
  const { data } = await api.post("/upload-resume", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function analyzeSkills(payload) {
  const { data } = await api.post("/analyze-skills", payload);
  return data;
}

export async function generateRoadmap(payload) {
  const { data } = await api.post("/generate-roadmap", payload);
  return data;
}

export async function downloadReport(payload) {
  const response = await api.post("/download-report", payload, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "skillpath-report.pdf";
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function startAnalysisJob(payload) {
  const { data } = await api.post("/start-analysis-job", payload);
  return data;
}

export async function getJobStatus(jobId) {
  const { data } = await api.get(`/job-status/${jobId}`);
  return data;
}

export async function suggestSkills(query) {
  const { data } = await api.get("/skills/suggest", { params: { q: query, limit: 8 } });
  return data.suggestions || [];
}

export async function analyzeResume(file) {
  const form = new FormData();
  form.append("resume", file);
  const { data } = await api.post("/resume-analyzer", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

export async function getCareerRecommendations(skillsCsv) {
  return withCache(
    `career-reco:${skillsCsv}`,
    async () => {
      const { data } = await api.get("/career-recommendations", {
        params: { skills: skillsCsv }
      });
      return data.recommendations || [];
    },
    3 * 60 * 1000
  );
}

export async function getLearningResources() {
  return withCache(
    "learning-resources",
    async () => {
      const { data } = await api.get("/learning-resources");
      return data.resources || [];
    },
    5 * 60 * 1000
  );
}

export async function askMentor(message) {
  const { data } = await api.post("/mentor-chat", { message });
  return data.reply;
}

export async function getProgressSummary() {
  return withCache(
    "progress-summary",
    async () => {
      const { data } = await api.get("/progress-summary");
      return data;
    },
    60 * 1000
  );
}

export async function getLeaderboard() {
  return withCache(
    "leaderboard",
    async () => {
      const { data } = await api.get("/community/leaderboard");
      return data.leaderboard || [];
    },
    60 * 1000
  );
}

export async function getCommunityGroups() {
  return withCache(
    "community-groups",
    async () => {
      const { data } = await api.get("/community/groups");
      return data.groups || [];
    },
    30 * 1000
  );
}

export async function createCommunityGroup(payload) {
  const { data } = await api.post("/community/groups", payload);
  return data;
}

export async function joinCommunityGroup(groupId) {
  const { data } = await api.post(`/community/groups/${groupId}/join`);
  return data;
}

export async function getAdminAnalytics() {
  return withCache(
    "admin-analytics",
    async () => {
      const { data } = await api.get("/admin/analytics");
      return data;
    },
    60 * 1000
  );
}

export async function getNotificationPreview(stagnationDays = 0) {
  const { data } = await api.post("/notifications/preview", { stagnationDays });
  return data.alerts || [];
}

export async function getStudents(query = "") {
  const { data } = await api.get("/students", { params: { q: query } });
  return data.students || [];
}

export async function addStudent(payload) {
  const { data } = await api.post("/students", payload);
  return data;
}

export async function removeStudent(studentId) {
  const { data } = await api.delete(`/students/${studentId}`);
  return data;
}
