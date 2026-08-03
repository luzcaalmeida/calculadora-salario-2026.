import React, { useState } from 'react';
import { User } from '../types';

interface ProfileFormProps {
  initialName: string;
  initialEmail: string;
  onComplete: (data: Partial<User>) => void;
}

export default function ProfileForm({ initialName, initialEmail, onComplete }: ProfileFormProps) {
  const [name, setName] = useState(initialName || '');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onComplete({ name, phone, company });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-cyan-500/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-100 uppercase tracking-tight">
          Completar Perfil
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500 tracking-widest uppercase">
          Precisamos de mais alguns detalhes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 py-8 px-4 border border-neutral-800 sm:px-10 rounded-none shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Nome</label>
              <div className="mt-1">
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="appearance-none block w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-none focus:outline-none focus:border-cyan-500 text-neutral-100 sm:text-sm transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Email</label>
              <div className="mt-1">
                <input id="email" type="email" disabled value={initialEmail} className="appearance-none block w-full px-3 py-2 bg-neutral-950/50 border border-neutral-800/50 rounded-none text-neutral-600 sm:text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Telefone (Opcional)</label>
              <div className="mt-1">
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="appearance-none block w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-none focus:outline-none focus:border-cyan-500 text-neutral-100 sm:text-sm transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="company" className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Empresa (Opcional)</label>
              <div className="mt-1">
                <input id="company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="appearance-none block w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-none focus:outline-none focus:border-cyan-500 text-neutral-100 sm:text-sm transition-colors" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-none shadow-sm text-sm font-bold text-black bg-cyan-500 hover:bg-cyan-400 focus:outline-none disabled:opacity-50 transition-colors uppercase tracking-wider">
                {isLoading ? 'A GUARDAR...' : 'GUARDAR E CONTINUAR'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
