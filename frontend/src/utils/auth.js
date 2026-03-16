import { clearOnboarding } from "./userExperience";  
 
export const AUTH_KEY = "skillpath_auth";  
const CURRENT_USER_KEY = "skillpath_current_user";  
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";  
 
export function isAuthenticated() {  
  return localStorage.getItem(AUTH_KEY) === "true";  
}  
 
export function loginUser(user = {}) {  
  localStorage.setItem(AUTH_KEY, "true");  
  if (user.email) {  
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));  
    localStorage.setItem("skillpath_username", user.name || user.email.split("@")[0]);  
  }  
}  
 
export function logoutUser() {  
  localStorage.removeItem(AUTH_KEY);  
  localStorage.removeItem(CURRENT_USER_KEY);  
  localStorage.removeItem("skillpath_username");  
  clearOnboarding();  
}  
 
export async function registerUser({ name, email, password }) {  
  try {  
    const res = await fetch(`${API_BASE}/auth/register`, {  
      method: "POST",  
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify({ name, email, password })  
    });  
    const data = await res.json().catch(() => ({}));  
    if (!res.ok) return { ok: false, message: data.error || "Registration failed." };  
    loginUser(data.user || { name, email });  
    return { ok: true };  
  } catch {  
    return { ok: false, message: `Unable to reach backend at ${API_BASE}. Start backend and try again.` };  
  }  
}  
 
export async function authenticateUser({ email, password }) {  
  try {  
    const res = await fetch(`${API_BASE}/auth/login`, {  
      method: "POST",  
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify({ email, password })  
    });  
    const data = await res.json().catch(() => ({}));  
    if (!res.ok) return { ok: false, message: data.error || "Login failed." };  
    loginUser(data.user || { email });  
    return { ok: true };  
  } catch {  
    return { ok: false, message: `Unable to reach backend at ${API_BASE}. Start backend and try again.` };  
  }  
}  
 
export async function warmupBackend() {  
  try {  
    await fetch(`${API_BASE}/health`, { method: "GET" });  
    return true;  
  } catch {  
    return false;  
  }  
}  
 
export function getCurrentUser() {  
  try {  
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");  
  } catch {  
    return null;  
  }  
}  



