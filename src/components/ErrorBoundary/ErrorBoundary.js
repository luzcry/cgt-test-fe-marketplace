import { Component } from 'react';
import { AlertIcon } from '../Icons';
import Button from '../Button';
import './ErrorBoundary.scss';

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

    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__content">
            <div className="error-boundary__icon" aria-hidden="true">
              <AlertIcon />
            </div>

            <h2 className="error-boundary__title">Something went wrong</h2>

            <p className="error-boundary__message">
              We're sorry, but something unexpected happened. Please try again
              or refresh the page.
            </p>

            <div className="error-boundary__actions">
              <Button
                variant="primary"
                className="error-boundary__btn error-boundary__btn--primary"
                onClick={this.handleRetry}
              >
                Try Again
              </Button>

              <Button
                variant="secondary"
                className="error-boundary__btn error-boundary__btn--secondary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
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
