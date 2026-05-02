'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    if (!result.success) toast.error(result.message || 'Login failed');
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen dot-grid flex items-stretch relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #1f1929 55%, #1a1824 100%)' }}
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,108,132,0.14) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(53,92,125,0.18) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '30%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(248,177,149,0.07) 0%, transparent 65%)',
        }} />
      </div>

      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ width: '45%', background: 'linear-gradient(155deg, #221c2a 0%, #2c2436 60%, #1f2535 100%)', borderRight: '1px solid rgba(248,177,149,0.08)' }}
      >
        {/* Decorative lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(248,177,149,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(248,177,149,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Large decorative house icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 300 280" width="340" height="320" fill="none" opacity="0.055">
            <path d="M150 20L280 130V270H190V180H110V270H20V130L150 20Z" fill="url(#hg)" stroke="rgba(248,177,149,0.3)" strokeWidth="2"/>
            <defs>
              <linearGradient id="hg" x1="20" y1="20" x2="280" y2="270">
                <stop stopColor="#F8B195"/>
                <stop offset="1" stopColor="#355C7D"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 p-12 pt-14">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-primary" style={{ boxShadow: '0 6px 20px rgba(192,108,132,0.4)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V9.5Z" fill="white"/>
              </svg>
            </div>
            <span className="font-display text-2xl font-bold text-white" style={{ letterSpacing: '0.12em' }}>ESTATE CRM</span>
          </div>
          <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(248,177,149,0.4)', letterSpacing: '0.18em' }}>
            Pakistan&apos;s Premier Property Platform
          </p>
        </div>

        <div className="relative z-10 p-12 pb-14">
          <blockquote className="font-display text-2xl font-medium leading-snug mb-6" style={{ color: 'rgba(240,232,224,0.85)' }}>
            &ldquo;The art of real estate is knowing where to look — and when to act.&rdquo;
          </blockquote>
          <div className="flex items-center gap-8">
            {[['2.4k+', 'Leads Managed'], ['98%', 'Client Satisfaction'], ['150+', 'Active Agents']].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold" style={{ color: '#F8B195' }}>{n}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(240,232,224,0.3)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex flex-col items-center mb-10 animate-fade-up">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 gradient-primary" style={{ boxShadow: '0 6px 20px rgba(192,108,132,0.4)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.6 20.6 21 20 21H15V15H9V21H4C3.4 21 3 20.6 3 20V9.5Z" fill="white"/>
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-white" style={{ letterSpacing: '0.12em' }}>ESTATE CRM</span>
        </div>

        <div className="w-full animate-fade-up-1" style={{ maxWidth: '420px' }}>
          <div className="mb-8">
            <h2 className="font-display text-4xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: 'rgba(248,177,149,0.5)' }}>
              Sign in to access your workspace
            </p>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(34, 28, 42, 0.85)',
              border: '1px solid rgba(248,177,149,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="section-label block mb-2">Email Address</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-base" placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="section-label block mb-2">Password</label>
                <input
                  type="password" required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-base" placeholder="••••••••"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>

            <div className="mt-6 pt-5 text-center" style={{ borderTop: '1px solid rgba(248,177,149,0.08)' }}>
              <p className="text-sm" style={{ color: 'rgba(240,232,224,0.35)' }}>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold" style={{ color: '#F8B195' }}>
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-3 mt-6 justify-center animate-fade-up-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34d399' }} />
              <span className="text-xs" style={{ color: 'rgba(240,232,224,0.3)' }}>Secure login</span>
            </div>
            <div style={{ width: '1px', height: '12px', background: 'rgba(248,177,149,0.12)' }} />
            <span className="text-xs" style={{ color: 'rgba(240,232,224,0.3)' }}>256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
