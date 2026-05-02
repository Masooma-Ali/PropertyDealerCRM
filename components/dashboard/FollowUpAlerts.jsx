'use client';
import Link from 'next/link';

function AlertItem({ lead, basePath, type }) {
  const configs = {
    overdue: { bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.18)', dot: '#f87171', label: 'Overdue', labelStyle: { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }, dateColor: '#f87171' },
    upcoming: { bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.18)', dot: '#fbbf24', label: 'Soon', labelStyle: { background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }, dateColor: '#fbbf24' },
    stale: { bg: 'rgba(73,77,95,0.2)', border: 'rgba(73,77,95,0.35)', dot: 'rgba(229,234,245,0.3)', label: 'Stale', labelStyle: { background: 'rgba(73,77,95,0.3)', color: 'rgba(229,234,245,0.5)', border: '1px solid rgba(73,77,95,0.5)' }, dateColor: 'rgba(229,234,245,0.35)' },
  };
  const c = configs[type];

  return (
    <Link href={`${basePath}/${lead._id}`} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px',
      padding: '10px 14px', textDecoration: 'none', transition: 'opacity 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
        <div>
          <div style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>{lead.name}</div>
          <div style={{ color: c.dateColor, fontSize: '11px', marginTop: '2px' }}>
            {type === 'stale'
              ? `Last active: ${new Date(lead.lastActivityAt).toLocaleDateString('en-PK')}`
              : `Due: ${new Date(lead.followUpDate).toLocaleDateString('en-PK')}`}
          </div>
        </div>
      </div>
      <span style={{ ...c.labelStyle, borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '600' }}>
        {c.label}
      </span>
    </Link>
  );
}

export default function FollowUpAlerts({ overdue = [], upcoming = [], stale = [], role = 'admin' }) {
  const basePath = `/${role}/leads`;

  if (!overdue.length && !upcoming.length && !stale.length) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(229,234,245,0.3)', fontSize: '14px' }}>
        ✅ No follow-up alerts right now
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {overdue.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f87171', marginBottom: '8px' }}>
            Overdue ({overdue.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {overdue.slice(0, 4).map(l => <AlertItem key={l._id} lead={l} basePath={basePath} type="overdue" />)}
          </div>
        </div>
      )}
      {upcoming.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '8px' }}>
            Upcoming ({upcoming.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {upcoming.slice(0, 4).map(l => <AlertItem key={l._id} lead={l} basePath={basePath} type="upcoming" />)}
          </div>
        </div>
      )}
      {stale.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(229,234,245,0.35)', marginBottom: '8px' }}>
            Stale 7d+ ({stale.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {stale.slice(0, 4).map(l => <AlertItem key={l._id} lead={l} basePath={basePath} type="stale" />)}
          </div>
        </div>
      )}
    </div>
  );
}