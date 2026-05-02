'use client';

export default function LeadFilters({ filters, onChange }) {
  const selectStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(160,210,235,0.15)',
    borderRadius: '10px',
    padding: '9px 14px',
    fontSize: '13px',
    fontFamily: 'Outfit, sans-serif',
    color: 'rgba(229,234,245,0.8)',
    outline: 'none',
    cursor: 'pointer',
  };

  const hasFilters = filters.status || filters.score || filters.source || filters.search;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
      {/* Search */}
      <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '320px' }}>
        <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'rgba(160,210,235,0.5)' }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text" placeholder="Search leads..."
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          style={{
            ...selectStyle, paddingLeft: '36px', width: '100%',
            color: 'rgba(229,234,245,0.9)',
          }}
          onFocus={e => e.target.style.border = '1px solid rgba(132,89,179,0.5)'}
          onBlur={e => e.target.style.border = '1px solid rgba(160,210,235,0.15)'}
        />
      </div>

      {/* Status */}
      <select value={filters.status || ''} onChange={e => onChange({ ...filters, status: e.target.value })} style={selectStyle}>
        <option value="" style={{ background: '#1C1B27' }}>All Status</option>
        {['New', 'Contacted', 'In Progress', 'Negotiation', 'Closed', 'Lost'].map(s =>
          <option key={s} value={s} style={{ background: '#1C1B27' }}>{s}</option>
        )}
      </select>

      {/* Priority */}
      <select value={filters.score || ''} onChange={e => onChange({ ...filters, score: e.target.value })} style={selectStyle}>
        <option value="" style={{ background: '#1C1B27' }}>All Priority</option>
        {['High', 'Medium', 'Low'].map(s =>
          <option key={s} value={s} style={{ background: '#1C1B27' }}>{s}</option>
        )}
      </select>

      {/* Source */}
      <select value={filters.source || ''} onChange={e => onChange({ ...filters, source: e.target.value })} style={selectStyle}>
        <option value="" style={{ background: '#1C1B27' }}>All Sources</option>
        {['Facebook Ads', 'Walk-in', 'Website', 'Referral', 'Other'].map(s =>
          <option key={s} value={s} style={{ background: '#1C1B27' }}>{s}</option>
        )}
      </select>

      {/* Clear */}
      {hasFilters && (
        <button onClick={() => onChange({})}
          style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '10px', padding: '9px 14px', fontSize: '13px',
            color: '#f87171', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}