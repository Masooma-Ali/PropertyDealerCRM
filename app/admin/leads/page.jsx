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
    const res = await fetch('/api/agents', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setAgents(data.agents);
  }

  useEffect(() => {
    fetchLeads(filters);
    loadAgents();
  }, [filters]);

  // Real-time socket updates
  useSocket(useCallback((event) => {
    if (['lead:created', 'lead:updated', 'lead:deleted', 'lead:assignment-changed'].includes(event)) {
      fetchLeads(filters);
      toast.success('Leads updated in real-time');
    }
  }, [filters]));

  async function handleDelete(id) {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    const result = await deleteLead(id);
    if (result.success) {
      toast.success('Lead deleted');
      fetchLeads(filters);
    } else {
      toast.error(result.message);
    }
  }

  async function handleAssign(leadId, agentId) {
    if (!agentId) return;
    const result = await assignLead(leadId, agentId);
    if (result.success) toast.success('Lead assigned successfully');
    else toast.error(result.message);
  }

  return (
    <div>
      <Header title="All Leads" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">{leads.length} leads found</p>
          <Link
            href="/admin/leads/new"
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            + Add Lead
          </Link>
        </div>

        <div className="mb-5">
          <LeadFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400 animate-pulse">Loading leads...</div>
          ) : (
            <LeadTable
              leads={leads}
              role="admin"
              agents={agents}
              onDelete={handleDelete}
              onAssign={handleAssign}
            />
          )}
        </div>
      </div>
    </div>
  );
}