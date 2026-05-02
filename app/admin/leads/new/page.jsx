'use client';
import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import LeadForm from '@/components/leads/LeadForm';
import Header from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function NewLeadPage() {
  const { createLead } = useLeads();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData) {
    setLoading(true);
    const result = await createLead(formData);
    if (result.success) { toast.success('Lead created!'); router.push('/admin/leads'); }
    else toast.error(result.message || 'Failed to create lead');
    setLoading(false);
  }

  return (
    <div>
      <Header title="Add New Lead" subtitle="Capture a new property inquiry" />

      <div style={{ padding: '28px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px' }}>
          <Link href="/admin/leads" style={{ color: 'rgba(160,210,235,0.5)', textDecoration: 'none' }}>All Leads</Link>
          <span style={{ color: 'rgba(229,234,245,0.2)' }}>›</span>
          <span style={{ color: 'rgba(229,234,245,0.6)' }}>New Lead</span>
        </div>

        {/* Scoring hint */}
        <div style={{
          background: 'rgba(132,89,179,0.08)', border: '1px solid rgba(132,89,179,0.2)',
          borderRadius: '12px', padding: '14px 18px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '18px' }}>⚡</span>
          <div>
            <div style={{ color: '#D0B0F4', fontWeight: '600', fontSize: '13px' }}>Auto Lead Scoring</div>
            <div style={{ color: 'rgba(229,234,245,0.5)', fontSize: '12px', marginTop: '2px' }}>
              Budget &gt; 20M → High · 10–20M → Medium · &lt; 10M → Low priority
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '28px', maxWidth: '760px' }}>
          <LeadForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}