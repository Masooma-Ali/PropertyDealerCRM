'use client';
import { useAuth } from '@/context/AuthContext';

export default function Header({ title }) {
  const { user } = useAuth();
  const now = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-white font-bold text-xl">{title}</h1>
        <p className="text-gray-400 text-xs mt-0.5">{now}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">Welcome,</span>
        <span className="text-emerald-400 font-semibold text-sm">{user?.name}</span>
      </div>
    </header>
  );
}