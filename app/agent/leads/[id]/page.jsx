'use client';
import { useEffect, useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import LeadForm from '@/components/leads/LeadForm';
import ActivityTimeline from '@/components/leads/ActivityTimeline';
import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function AgentLeadDetailPage({ params }) {
  const { updateLead } = useLeads();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('details');

  useEffect(() => {
    async function fetchLead() {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leads/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setLead(data.lead);
    }
    fetchLead();
  }, [params.id]);

  async function handleUpdate(formData) {
    setLoading(true);
    const result = await updateLead(params.id, formData);
    if (result.success) {
      toast.success('Lead updated!');
      setLead(result.lead);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  }

  if (!lead) return (
    <div>
      <Header title="Lead Detail" />
      <div className="p-6 text-gray-400 animate-pulse">Loading...</div>
    </div>
  );

  const whatsappPhone = lead.phone?.replace(/\D/g, '');

  return (
    <div>
      <Header title={lead.name} />
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Badge label={lead.score} />
          <Badge label={lead.status} />
          {lead.phone && (
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-green-500/30 transition"
            >
              💬 WhatsApp
            </a>
          )}
        </div>

        <div className="flex gap-1 mb-6 border-b border-gray-800">
          {['details', 'activity'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition ${tab === t ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white'}`}>
              {t === 'details' ? '📋 Details' : '📜 Activity'}
            </button>
          ))}
        </div>

        {tab === 'details' ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-3xl">
            <LeadForm initialData={lead} onSubmit={handleUpdate} loading={loading} isEdit />
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl">
            <h3 className="text-white font-semibold mb-4">Activity Log</h3>
            <ActivityTimeline leadId={params.id} />
          </div>
        )}
      </div>
    </div>
  );
}
