'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'admin') router.push('/agent/dashboard');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-emerald-400 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}