import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-paper p-6 text-ink">
          <div className="glass max-w-md rounded-app p-8 text-center">
            <h1 className="text-2xl font-black">Something went wrong</h1>
            <p className="mt-3 text-slate-600">Refresh the page to reload TaskFlow AI.</p>
            <button
              className="mt-6 rounded-2xl bg-primary px-5 py-3 font-bold text-white"
              onClick={() => window.location.reload()}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
