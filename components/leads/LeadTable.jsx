'use client';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

function formatBudget(budget) {
  if (budget >= 10_000_000) return `${(budget / 10_000_000).toFixed(1)} Cr`;
  if (budget >= 100_000) return `${(budget / 100_000).toFixed(1)} L`;
  return budget?.toLocaleString();
}

export default function LeadTable({ leads, role, onDelete, onAssign, agents }) {
  if (!leads || leads.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(229,234,245,0.25)' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
        <div style={{ fontSize: '14px' }}>No leads found</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="crm-table">
        <thead>
          <tr>
            {['Client', 'Contact', 'Interest', 'Budget', 'Priority', 'Status', 'Source', 'Assigned', 'Actions'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const phone = lead.phone?.replace(/\D/g, '');
            return (
              <tr key={lead._id}>
                {/* Client */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(132,89,179,0.3), rgba(160,210,235,0.2))',
                      border: '1px solid rgba(132,89,179,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '600', fontSize: '13px', color: '#D0B0F4',
                    }}>
                      {lead.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: 'white', fontWeight: '500', fontSize: '13.5px' }}>{lead.name}</div>
                      {lead.location && <div style={{ color: 'rgba(229,234,245,0.35)', fontSize: '11px' }}>{lead.location}</div>}
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td>
                  <div style={{ fontSize: '12px', color: 'rgba(229,234,245,0.5)' }}>{lead.email || '—'}</div>
                  {lead.phone && (
                    <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#34d399', fontSize: '12px', textDecoration: 'none', marginTop: '2px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {lead.phone}
                    </a>
                  )}
                </td>

                {/* Interest */}
                <td style={{ color: 'rgba(229,234,245,0.7)', fontSize: '13px' }}>{lead.propertyInterest}</td>

                {/* Budget */}
                <td>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '13px', fontFamily: 'Playfair Display, serif' }}>
                    PKR {formatBudget(lead.budget)}
                  </span>
                </td>

                {/* Priority */}
                <td><Badge label={lead.score} /></td>

                {/* Status */}
                <td><Badge label={lead.status} /></td>

                {/* Source */}
                <td style={{ color: 'rgba(229,234,245,0.45)', fontSize: '12px' }}>{lead.source}</td>

                {/* Assigned */}
                <td>
                  {role === 'admin' && agents ? (
                    <select
                      defaultValue={lead.assignedTo?._id || ''}
                      onChange={e => onAssign && onAssign(lead._id, e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(160,210,235,0.15)',
                        borderRadius: '8px', padding: '5px 10px', fontSize: '12px',
                        fontFamily: 'Outfit, sans-serif', color: 'rgba(229,234,245,0.7)', outline: 'none',
                      }}>
                      <option value="" style={{ background: '#1C1B27' }}>Unassigned</option>
                      {agents.map(a => <option key={a._id} value={a._id} style={{ background: '#1C1B27' }}>{a.name}</option>)}
                    </select>
                  ) : (
                    <span style={{ color: 'rgba(229,234,245,0.45)', fontSize: '12px' }}>
                      {lead.assignedTo?.name || 'Unassigned'}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Link href={`/${role}/leads/${lead._id}`}
                      style={{
                        background: 'rgba(160,210,235,0.08)', border: '1px solid rgba(160,210,235,0.18)',
                        borderRadius: '7px', padding: '5px 12px', fontSize: '12px', color: '#A0D2EB',
                        textDecoration: 'none', fontWeight: '500', transition: 'background 0.15s',
                      }}>
                      View
                    </Link>
                    {role === 'admin' && (
                      <button onClick={() => onDelete && onDelete(lead._id)} className="btn-danger"
                        style={{ padding: '5px 10px', fontSize: '12px', borderRadius: '7px' }}>
                        Del
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}