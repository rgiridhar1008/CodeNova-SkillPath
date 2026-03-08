import { Navigate } from "react-router-dom";

export default function RoleGuard({ allow = ["user"], children }) {
  const role = localStorage.getItem("skillpath_role") || "user";
  if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
}
