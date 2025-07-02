/**
 * Error Boundary component for graceful error handling with cyberpunk styling.
 */

import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-900 border border-crash-red rounded-lg p-6 text-white">
            {/* Error Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-crash-red rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-tektur font-bold text-center mb-4 text-crash-red">
              System Error
            </h1>

            {/* Error Message */}
            <p className="text-center text-gray-300 mb-6">
              Something went wrong with the collision simulator. The system encountered an unexpected error.
            </p>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 bg-gray-800 rounded p-3 text-xs">
                <summary className="cursor-pointer text-crash-red font-mono mb-2">
                  Technical Details
                </summary>
                <div className="text-gray-400 whitespace-pre-wrap font-mono">
                  <p className="mb-2 text-red-400">Error: {this.state.error.message}</p>
                  <p className="mb-2">Stack Trace:</p>
                  <pre className="text-xs overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p className="mt-4 mb-2">Component Stack:</p>
                      <pre className="text-xs overflow-auto max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="
                  w-full px-4 py-2 bg-crash-red text-white font-tektur font-medium
                  rounded transition-all duration-200 hover:bg-red-600
                  focus:outline-none focus:ring-2 focus:ring-crash-red focus:ring-opacity-50
                "
              >
                Reload Application
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="
                  w-full px-4 py-2 bg-gray-700 text-white font-tektur font-medium
                  rounded transition-all duration-200 hover:bg-gray-600
                  focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50
                "
              >
                Return to Home
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                If this error persists, please check the browser console for more details
                or try refreshing the page.
              </p>
            </div>
          </div>

          {/* Background Animation */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-crash-red/20 rotate-45 animate-pulse animation-delay-1000" />
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-crash-red/10 rotate-12 animate-pulse animation-delay-2000" />
            <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-crash-red/15 -rotate-12 animate-pulse" />
          </div>

          <style>{`
            .animation-delay-1000 { animation-delay: 1000ms; }
            .animation-delay-2000 { animation-delay: 2000ms; }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 