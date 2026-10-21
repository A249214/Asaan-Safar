import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Avoid leaking sensitive passenger PII in console
    console.error('Asaan Safar Error:', error.name, error.message, errorInfo.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0E1312] text-[#F3F4F6] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#18221F] border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#B85C4A]/20 border border-[#B85C4A]/30 flex items-center justify-center mx-auto mb-6 text-[#B85C4A]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase tracking-widest text-[#C79A45] font-semibold">
              Asaan Safar Recovery
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mt-1 mb-3">
              Something went wrong
            </h2>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              An unexpected error occurred while loading this page. Your bookings and ticket details remain safe.
            </p>

            {this.state.error && (
              <div className="p-3 bg-black/40 rounded-lg text-left text-xs font-mono text-red-300 border border-red-500/20 mb-6 truncate">
                {this.state.error.message || 'Unknown Application State'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 border-white/20 hover:border-white/40"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button
                variant="gradient"
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
