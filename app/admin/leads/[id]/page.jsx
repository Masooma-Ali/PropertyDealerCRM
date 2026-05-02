'use client';
import { useEffect, useState, use } from 'react';
import { useLeads } from '@/hooks/useLeads';
import LeadForm from '@/components/leads/LeadForm';
import ActivityTimeline from '@/components/leads/ActivityTimeline';
import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminLeadDetailPage({ params }) {
  const { id } = use(params);
  const { updateLead } = useLeads();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('details');

  useEffect(() => {
    async function fetchLead() {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setLead(data.lead);
    }
    if (id) fetchLead();
  }, [id]);

  async function handleUpdate(formData) {
    setLoading(true);
    const result = await updateLead(id, formData);
    if (result.success) { toast.success('Lead updated!'); setLead(result.lead); }
    else toast.error(result.message);
    setLoading(false);
  }

  if (!lead) {
    return (
      <div>
        <Header title="Lead Detail" />
        <div style={{ padding: '28px', color: 'rgba(229,234,245,0.3)', fontSize: '14px' }}>Loading lead...</div>
      </div>
    );
  }

  const whatsappPhone = lead.phone?.replace(/\D/g, '');

  return (
    <div>
      <Header title={lead.name} subtitle={lead.propertyInterest + (lead.location ? ` · ${lead.location}` : '')} />

      <div style={{ padding: '28px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px' }}>
          <Link href="/admin/leads" style={{ color: 'rgba(160,210,235,0.5)', textDecoration: 'none' }}>All Leads</Link>
          <span style={{ color: 'rgba(229,234,245,0.2)' }}>›</span>
          <span style={{ color: 'rgba(229,234,245,0.6)' }}>{lead.name}</span>
        </div>

        {/* Info bar */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px',
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px',
          padding: '16px 20px', marginBottom: '24px',
        }}>
          <Badge label={lead.score} />
          <Badge label={lead.status} />
          <div style={{ width: '1px', height: '20px', background: 'rgba(160,210,235,0.12)' }} />
          <span style={{ fontSize: '13px', color: 'rgba(229,234,245,0.5)' }}>
            PKR {lead.budget?.toLocaleString()}
          </span>
          {lead.phone && (
            <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(52,211,153,0.1)', color: '#34d399',
                border: '1px solid rgba(52,211,153,0.25)', borderRadius: '20px',
                padding: '5px 14px', fontSize: '12px', fontWeight: '600', textDecoration: 'none',
                transition: 'background 0.15s',
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          )}
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'rgba(229,234,245,0.35)' }}>
            Assigned to: <span style={{ color: 'rgba(208,176,244,0.7)' }}>{lead.assignedTo?.name || 'Unassigned'}</span>
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid rgba(160,210,235,0.08)', paddingBottom: '0' }}>
          {[['details', 'Lead Details'], ['activity', 'Activity Timeline']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '10px 20px', fontSize: '13.5px', fontWeight: '500', cursor: 'pointer',
                border: 'none', background: 'transparent', fontFamily: 'Outfit, sans-serif',
                color: tab === t ? '#A0D2EB' : 'rgba(229,234,245,0.4)',
                borderBottom: tab === t ? '2px solid #8459B3' : '2px solid transparent',
                transition: 'color 0.15s', marginBottom: '-1px',
              }}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'details' ? (
          <div className="card" style={{ padding: '28px', maxWidth: '760px' }}>
            <LeadForm initialData={lead} onSubmit={handleUpdate} loading={loading} isEdit />
          </div>
        ) : (
          <div className="card" style={{ padding: '24px', maxWidth: '600px' }}>
            <ActivityTimeline leadId={id} />
          </div>
        )}
      </div>
    </div>
  );
}