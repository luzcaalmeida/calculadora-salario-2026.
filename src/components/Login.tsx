import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../utils/firebaseError';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao fazer login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-cyan-500/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-cyan-950 border border-cyan-800 rounded-none flex items-center justify-center">
            <Calculator className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-100 tracking-tight uppercase">
          Calculadora de Salários
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500 tracking-widest uppercase">
          Aceda à sua conta com o Google
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 py-8 px-4 border border-neutral-800 sm:px-10 text-center rounded-none shadow-2xl">
          
          {error && (
            <div className="mb-4 text-red-400 text-sm text-left bg-red-950/20 p-3 rounded-none border border-red-900/50">
              {error}
            </div>
          )}

          <button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-neutral-700 rounded-none text-sm font-medium text-neutral-200 bg-neutral-950 hover:bg-neutral-800 hover:border-cyan-500 hover:text-cyan-400 focus:outline-none focus:border-cyan-500 disabled:opacity-50 transition-all uppercase tracking-wider"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isLoading ? 'A iniciar sessão...' : 'Continuar com o Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
