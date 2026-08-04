import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NexusMart ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full bg-white border border-slate-200 shadow-xl space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Oops! Something went wrong</h2>
              <p className="text-xs text-slate-500">
                We encountered an unexpected visual rendering issue. Don't worry, your cart and items are completely safe.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 text-xs rounded-xl flex-1 inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-white" />
                <span>Reload Page</span>
              </button>
              <a
                href="/"
                className="btn-secondary py-2.5 px-4 text-xs rounded-xl flex-1 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
