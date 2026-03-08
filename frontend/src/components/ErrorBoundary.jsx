import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep this minimal to avoid noisy console in production.
    console.error("UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-red-300/30 bg-red-500/10 p-6 text-center">
          <p className="font-heading text-2xl font-semibold">Something went wrong</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Please refresh the page. If this persists, try again later.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
