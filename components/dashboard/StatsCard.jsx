const colorMap = {
  violet:  { bg: 'rgba(108,91,123,0.14)',  border: 'rgba(108,91,123,0.28)',  icon: '#C06C84', accent: '#6C5B7B' },
  sky:     { bg: 'rgba(53,92,125,0.14)',   border: 'rgba(53,92,125,0.28)',   icon: '#7aafc8', accent: '#355C7D' },
  red:     { bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.2)',    icon: '#f87171', accent: '#ef4444' },
  amber:   { bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.2)',   icon: '#fbbf24', accent: '#f59e0b' },
  green:   { bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.2)',   icon: '#34d399', accent: '#10b981' },
  emerald: { bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.2)',   icon: '#34d399', accent: '#10b981' },
  blue:    { bg: 'rgba(53,92,125,0.14)',   border: 'rgba(53,92,125,0.28)',   icon: '#7aafc8', accent: '#355C7D' },
  purple:  { bg: 'rgba(108,91,123,0.14)',  border: 'rgba(108,91,123,0.28)',  icon: '#C06C84', accent: '#6C5B7B' },
};

export default function StatsCard({ title, value, subtitle, icon, color = 'violet', trend }) {
  const c = colorMap[color] || colorMap.violet;

  return (
    <div className="card p-5 animate-fade-up" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background accent glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '90px', height: '90px',
        background: `radial-gradient(circle at top right, ${c.accent}16, transparent 68%)`,
        pointerEvents: 'none',
      }} />
      {/* Subtle top border accent */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${c.accent}40, transparent)`,
      }} />

      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <span style={{ color: c.icon, fontSize: '18px' }}>{icon}</span>
        </div>
        {trend !== undefined && (
          <span className="stat-chip" style={{
            background: trend >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            color: trend >= 0 ? '#34d399' : '#f87171',
            border: `1px solid ${trend >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="font-display text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium" style={{ color: 'rgba(240,232,224,0.65)' }}>{title}</div>
      {subtitle && <div className="text-xs mt-1" style={{ color: 'rgba(240,232,224,0.32)' }}>{subtitle}</div>}
    </div>
  );
}
