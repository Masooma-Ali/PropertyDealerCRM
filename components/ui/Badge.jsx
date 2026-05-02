export default function Badge({ label }) {
  const styles = {
    High:          { bg: 'rgba(239,68,68,0.12)',    color: '#f87171',  border: 'rgba(239,68,68,0.25)' },
    Medium:        { bg: 'rgba(245,158,11,0.12)',   color: '#fbbf24',  border: 'rgba(245,158,11,0.25)' },
    Low:           { bg: 'rgba(16,185,129,0.12)',   color: '#34d399',  border: 'rgba(16,185,129,0.25)' },
    New:           { bg: 'rgba(248,177,149,0.12)',  color: '#F8B195',  border: 'rgba(248,177,149,0.25)' },
    Contacted:     { bg: 'rgba(192,108,132,0.12)',  color: '#d67fa0',  border: 'rgba(192,108,132,0.25)' },
    'In Progress': { bg: 'rgba(246,114,128,0.12)',  color: '#f47d8a',  border: 'rgba(246,114,128,0.25)' },
    Negotiation:   { bg: 'rgba(108,91,123,0.15)',   color: '#a07abf',  border: 'rgba(108,91,123,0.3)' },
    Closed:        { bg: 'rgba(16,185,129,0.12)',   color: '#34d399',  border: 'rgba(16,185,129,0.25)' },
    Lost:          { bg: 'rgba(73,77,95,0.28)',     color: 'rgba(240,232,224,0.38)', border: 'rgba(73,77,95,0.45)' },
  };

  const s = styles[label] || { bg: 'rgba(73,77,95,0.28)', color: 'rgba(240,232,224,0.45)', border: 'rgba(73,77,95,0.45)' };

  return (
    <span style={{
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: '20px',
      padding: '3px 10px',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
