import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-lg">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-white mb-2">3D渲染不可用</h2>
            <p className="text-white/60">
              当前环境不支持WebGL<br />
              请在支持WebGL的浏览器中打开
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
