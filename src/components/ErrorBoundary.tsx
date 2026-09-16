import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('sorumlu_kim_complaints');
      localStorage.removeItem('sorumlu_kim_proposals');
      localStorage.removeItem('sorumlu_kim_utility_works');
    } catch (e) {}
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4 text-[#121212] font-sans">
          <div className="max-w-md w-full bg-white rounded-xl border border-neutral-300 p-6 shadow-md text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 border border-red-300 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h2 className="text-base font-black uppercase tracking-tight text-[#121212]">
              Uygulama Yüklenirken Bir Sorun Oluştu
            </h2>
            
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              {this.state.error?.message || 'Beklenmedik bir durum oluştu. Tarayıcı önbelleğini sıfırlayıp uygulamayı yeniden başlatabilirsiniz.'}
            </p>

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-neutral-800 text-white text-xs font-mono font-bold uppercase transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Yeniden Başlat & Sıfırla</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

