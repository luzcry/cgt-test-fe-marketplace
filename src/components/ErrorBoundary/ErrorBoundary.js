import { Component } from 'react';
import './ErrorBoundary.scss';

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs the errors, and displays a fallback UI instead of crashing the app.
 *
 * Best Practices:
 * - Uses class component (required for error boundaries)
 * - Provides user-friendly error message
 * - Includes retry functionality
 * - Logs errors for debugging
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: errorReportingService.log({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__content">
            <div className="error-boundary__icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h2 className="error-boundary__title">Something went wrong</h2>

            <p className="error-boundary__message">
              We're sorry, but something unexpected happened. Please try again
              or refresh the page.
            </p>

            <div className="error-boundary__actions">
              <button
                type="button"
                className="error-boundary__btn error-boundary__btn--primary"
                onClick={this.handleRetry}
              >
                Try Again
              </button>

              <button
                type="button"
                className="error-boundary__btn error-boundary__btn--secondary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary__details">
                <summary>Error Details</summary>
                <pre className="error-boundary__stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
