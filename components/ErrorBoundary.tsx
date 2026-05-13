import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
                    <div className="glass max-w-lg w-full p-8 rounded-3xl border border-red-500/20 shadow-2xl shadow-red-500/10 text-center space-y-6">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                            Bir Şeyler Ters Gitti
                        </h1>
                        <p className="text-slate-400">
                            Uygulama çalışırken beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyebilirsiniz.
                        </p>
                        {this.state.error && (
                            <div className="bg-slate-900/50 p-4 rounded-xl text-left border border-slate-800 overflow-x-auto text-xs font-mono text-red-400/80">
                                {this.state.error.toString()}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 px-8 rounded-xl transition-all"
                        >
                            Sayfayı Yenile
                        </button>
                    </div>
                </div>
            );
        }

        // @ts-expect-error - React 19 typings issue with props
        return this.props.children;
    }
}

export default ErrorBoundary;
