import React from 'react';
import { toast } from '@/hooks/use-toast';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: any };

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    try {
      toast({ title: 'Unexpected error', description: error?.message || 'Something went wrong.', variant: 'destructive' as any });
      // eslint-disable-next-line no-console
      console.error('GlobalErrorBoundary', error, errorInfo);
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">Please refresh the page. If the issue persists, try logging in again.</p>
            <button className="px-4 py-2 rounded bg-primary text-primary-foreground" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary;
