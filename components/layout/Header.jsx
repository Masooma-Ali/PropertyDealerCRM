'use client';
import { useAuth } from '@/context/AuthContext';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const now = new Date().toLocaleDateString('en-PK', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header
      className="px-8 py-5 flex items-center justify-between"
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        minHeight: '72px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle warm top edge */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.18), transparent)',
      }} />

      {/* Left — title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white leading-tight" style={{ letterSpacing: '-0.01em' }}>
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm mt-1" style={{ color: 'rgba(248,177,149,0.5)' }}>
            {subtitle}
          </p>
        ) : (
          <p className="text-sm mt-1" style={{ color: 'rgba(248,177,149,0.35)' }}>
            {now}
          </p>
        )}
      </div>

      {/* Right — user indicator */}
      <div className="flex items-center gap-3">
        {/* Online dot */}
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: '#F8B195', boxShadow: '0 0 6px rgba(248,177,149,0.55)' }}
        />
        <span className="text-sm font-medium" style={{ color: 'rgba(240,232,224,0.55)' }}>
          {user?.name}
        </span>
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #C06C84, #F8B195)',
            boxShadow: '0 4px 12px rgba(192,108,132,0.32)',
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
