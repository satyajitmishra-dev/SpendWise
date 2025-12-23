import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    <p className="font-bold">Something went wrong.</p>
                    <p className="text-xs mt-1">{this.state.error?.message}</p>
                    <button onClick={() => this.setState({ hasError: false })} className="mt-2 text-xs underline">Try Again</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
