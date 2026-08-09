import { Component } from "react";
import { logger } from "@utils/logger";

/**
 * App-level error boundary. Catches render errors anywhere in the tree and
 * shows a branded fallback instead of a blank white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logger.error("Render error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="section-dark-primary surface-pattern flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
          <div className="card-surface max-w-lg px-8 py-12">
            <p className="text-xs uppercase tracking-widest text-white/60">
              Something went wrong
            </p>
            <h1 className="heading heading-h2 mt-3">Unexpected error</h1>
            <p className="text-text2 mt-4 text-white/70">
              Sorry - something broke while loading this page. Please try
              reloading.
            </p>
            <div className="mt-8">
              {/* Full reload to reset app state after a crash */}
              <a href="/" className="btn-primary btn-md">
                Back to Home
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
