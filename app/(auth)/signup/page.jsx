'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agent', phone: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const result = await signup(form);
    if (!result.success) toast.error(result.message || 'Signup failed');
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen dot-grid flex flex-col items-center justify-center relative overflow-hidden py-10"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #1f1929 55%, #1a1824 100%)' }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '550px', height: '550px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,108,132,0.13) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(53,92,125,0.15) 0%, transparent 65%)',
        }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center mb-8 animate-fade-up">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 gradient-primary"
          style={{ boxShadow: '0 6px 20px rgba(192,108,132,0.4)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V9.5Z" fill="white"/>
          </svg>
        </div>
        <span className="font-display text-2xl font-bold text-white" style={{ letterSpacing: '0.12em' }}>ESTATE CRM</span>
        <span className="text-xs mt-1 tracking-widest uppercase" style={{ color: 'rgba(248,177,149,0.4)', letterSpacing: '0.18em' }}>
          Pakistan&apos;s Premier Property Platform
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full px-6 animate-fade-up-1" style={{ maxWidth: '500px' }}>
        <div
          className="w-full rounded-2xl p-8"
          style={{
            background: 'rgba(34, 28, 42, 0.88)',
            border: '1px solid rgba(248,177,149,0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="text-center mb-7">
            <h2 className="font-display text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-sm" style={{ color: 'rgba(248,177,149,0.5)' }}>
              Join the platform to manage your leads
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-label block mb-2">Full Name</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-base" placeholder="John Doe" />
              </div>
              <div>
                <label className="section-label block mb-2">Phone</label>
                <input type="text" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="input-base" placeholder="923001234567" />
              </div>
            </div>

            <div>
              <label className="section-label block mb-2">Email Address</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-base" placeholder="you@example.com" />
            </div>

            <div>
              <label className="section-label block mb-2">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                className="input-base">
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="section-label block mb-2">Password</label>
              <input type="password" required value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-base" placeholder="Min 6 characters" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid rgba(248,177,149,0.08)' }}>
            <p className="text-sm" style={{ color: 'rgba(240,232,224,0.35)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold" style={{ color: '#F8B195' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
