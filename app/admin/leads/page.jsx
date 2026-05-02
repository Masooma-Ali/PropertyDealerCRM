'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useSocket } from '@/hooks/useSocket';
import LeadTable from '@/components/leads/LeadTable';
import LeadFilters from '@/components/leads/LeadFilters';
import Header from '@/components/layout/Header';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminLeadsPage() {
  const { leads, loading, fetchLeads, deleteLead, assignLead } = useLeads();
  const [agents, setAgents] = useState([]);
  const [filters, setFilters] = useState({});

  async function loadAgents() {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/agents', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) setAgents(data.agents);
  }

  useEffect(() => { fetchLeads(filters); loadAgents(); }, [filters]);

  useSocket(useCallback((event) => {
    if (['lead:created', 'lead:updated', 'lead:deleted', 'lead:assignment-changed'].includes(event)) {
      fetchLeads(filters);
    }
  }, [filters]));

  async function handleDelete(id) {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    const result = await deleteLead(id);
    if (result.success) { toast.success('Lead deleted'); fetchLeads(filters); }
    else toast.error(result.message);
  }

  async function handleAssign(leadId, agentId) {
    if (!agentId) return;
    const result = await assignLead(leadId, agentId);
    if (result.success) toast.success('Lead assigned');
    else toast.error(result.message);
  }

  return (
    <div>
      <Header title="All Leads" subtitle="Manage and track all property leads" />

      <div style={{ padding: '28px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="font-display" style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>
              {leads.length}
            </div>
            <span style={{ fontSize: '13px', color: 'rgba(240,232,224,0.4)' }}>leads found</span>
          </div>
          <Link
            href="/admin/leads/new"
            className="btn-primary"
            style={{ padding: '10px 20px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Lead
          </Link>
        </div>

        {/* Filters */}
        <div style={{ marginBottom: '20px' }}>
          <LeadFilters filters={filters} onChange={setFilters} />
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px', color: 'rgba(240,232,224,0.3)', fontSize: '14px' }}>
              <div className="shimmer" style={{ width: '100%', height: '4px', borderRadius: '2px', marginBottom: '32px' }} />
              Loading leads...
            </div>
          ) : (
            <LeadTable leads={leads} role="admin" agents={agents} onDelete={handleDelete} onAssign={handleAssign} />
          )}
        </div>
      </div>
    </div>
  );
}
