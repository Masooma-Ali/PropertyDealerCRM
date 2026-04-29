'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import FollowUpAlerts from '@/components/dashboard/FollowUpAlerts';
import Badge from '@/components/ui/Badge';
import { useSocket } from '@/hooks/useSocket';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [followUps, setFollowUps] = useState({ overdue: [], upcoming: [], stale: [] });
  const [loading, setLoading] = useState(true);

  function getToken() {
    return localStorage.getItem('token');
  }

  async function fetchLeads() {
    const res = await fetch('/api/leads', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (data.success) setLeads(data.leads);
  }

  async function fetchFollowUps() {
    const res = await fetch('/api/followups', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (data.success) setFollowUps(data);
  }

  useEffect(() => {
    async function init() {
      await Promise.all([fetchLeads(), fetchFollowUps()]);
      setLoading(false);
    }
    init();
  }, []);

  useSocket(useCallback((event) => {
    if (['lead:assigned', 'lead:updated'].includes(event)) {
      fetchLeads();
      fetchFollowUps();
      toast.success('Your leads have been updated');
    }
  }, []));

  // Derived stats
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const closedLeads = leads.filter((l) => l.status === 'Closed').length;
  const highPriority = leads.filter((l) => l.score === 'High').length;
  const totalAlerts =
    (followUps.overdue?.length || 0) +
    (followUps.upcoming?.length || 0) +
    (followUps.stale?.length || 0);

  // Recent leads — last 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <div>
        <Header title="My Dashboard" />
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="My Dashboard" />
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Assigned Leads" value={totalLeads} icon="📋" color="emerald" subtitle="Total assigned to you" />
          <StatsCard title="New Leads" value={newLeads} icon="🆕" color="blue" subtitle="Need first contact" />
          <StatsCard title="Closed Deals" value={closedLeads} icon="✅" color="purple" subtitle="Successfully closed" />
          <StatsCard title="High Priority" value={highPriority} icon="🔴" color="red" subtitle="Budget > 20M PKR" />
        </div>

        {/* Recent leads + follow-up alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Recent Leads */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Recent Leads</h3>
              <Link href="/agent/leads" className="text-emerald-400 text-xs hover:underline">
                View all →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">No leads assigned yet</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => {
                  const whatsappPhone = lead.phone?.replace(/\D/g, '');
                  return (
                    <Link
                      key={lead._id}
                      href={`/agent/leads/${lead._id}`}
                      className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600 transition group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium group-hover:text-emerald-400 transition truncate">
                          {lead.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-gray-500 text-xs">{lead.propertyInterest}</span>
                          {lead.phone && (
  <button
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open(`https://wa.me/${whatsappPhone}`, '_blank');
    }}
    className="text-green-400 text-xs hover:text-green-300"
  >
    💬
  </button>
)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <Badge label={lead.score} />
                        <Badge label={lead.status} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Follow-up Alerts */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Follow-up Alerts</h3>
              {totalAlerts > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold">
                  {totalAlerts} alerts
                </span>
              )}
            </div>
            <FollowUpAlerts
              overdue={followUps.overdue}
              upcoming={followUps.upcoming}
              stale={followUps.stale}
              role="agent"
            />
          </div>
        </div>

        {/* Quick status overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">My Lead Status Breakdown</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {['New', 'Contacted', 'In Progress', 'Negotiation', 'Closed', 'Lost'].map((status) => {
              const count = leads.filter((l) => l.status === status).length;
              return (
                <div key={status} className="text-center bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-xs text-gray-500 mt-1">{status}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}