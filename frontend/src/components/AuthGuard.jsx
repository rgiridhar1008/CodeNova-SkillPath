import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { isOnboardingComplete } from "../utils/userExperience";

export default function AuthGuard({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Please login to continue your journey.",
          from: location.pathname
        }}
      />
    );
  }

  const onboardingDone = isOnboardingComplete();
  if (!onboardingDone && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  if (onboardingDone && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
