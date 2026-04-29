'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useSocket } from '@/hooks/useSocket';
import LeadTable from '@/components/leads/LeadTable';
import LeadFilters from '@/components/leads/LeadFilters';
import Header from '@/components/layout/Header';
import toast from 'react-hot-toast';

export default function AgentLeadsPage() {
  const { leads, loading, fetchLeads } = useLeads();
  const [filters, setFilters] = useState({});

  useEffect(() => { fetchLeads(filters); }, [filters]);

  useSocket(useCallback((event) => {
    if (['lead:updated', 'lead:assigned'].includes(event)) {
      fetchLeads(filters);
      toast.success('Lead updated');
    }
  }, [filters]));

  return (
    <div>
      <Header title="My Leads" />
      <div className="p-6">
        <div className="mb-5">
          <LeadFilters filters={filters} onChange={setFilters} />
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-gray-400 animate-pulse">Loading leads...</div>
          ) : (
            <LeadTable leads={leads} role="agent" />
          )}
        </div>
      </div>
    </div>
  );
}