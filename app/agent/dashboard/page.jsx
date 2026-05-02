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
            <div key={i} className="card shimmer" style={{ height: '112px', borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  const statusColors = {
    New: '#F8B195', Contacted: '#d67fa0', 'In Progress': '#f47d8a',
    Negotiation: '#a07abf', Closed: '#34d399', Lost: 'rgba(240,232,224,0.3)',
  };

  return (
    <div>
      <Header title="My Dashboard" />
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Assigned Leads" value={totalLeads} icon="📋" color="violet" subtitle="Total assigned to you" />
          <StatsCard title="New Leads" value={newLeads} icon="🆕" color="sky" subtitle="Need first contact" />
          <StatsCard title="Closed Deals" value={closedLeads} icon="✅" color="green" subtitle="Successfully closed" />
          <StatsCard title="High Priority" value={highPriority} icon="🔴" color="red" subtitle="Budget > 20M PKR" />
        </div>

        {/* Recent leads + follow-up alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Recent Leads */}
          <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.22), transparent)',
            }} />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-white">Recent Leads</h3>
              <Link
                href="/agent/leads"
                className="text-xs font-medium"
                style={{ color: '#F8B195', textDecoration: 'none' }}
              >
                View all →
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: 'rgba(240,232,224,0.3)' }}>
                No leads assigned yet
              </p>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((lead) => {
                  const whatsappPhone = lead.phone?.replace(/\D/g, '');
                  return (
                    <Link
                      key={lead._id}
                      href={`/agent/leads/${lead._id}`}
                      className="flex items-center justify-between p-3 rounded-xl transition group"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(248,177,149,0.07)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,177,149,0.05)'; e.currentTarget.style.borderColor = 'rgba(248,177,149,0.15)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(248,177,149,0.07)'; }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                          background: 'linear-gradient(135deg, rgba(192,108,132,0.28), rgba(248,177,149,0.15))',
                          border: '1px solid rgba(192,108,132,0.22)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: '600', fontSize: '12px', color: '#F8B195',
                        }}>
                          {lead.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'white' }}>
                            {lead.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs" style={{ color: 'rgba(240,232,224,0.4)' }}>{lead.propertyInterest}</span>
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
          <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.22), transparent)',
            }} />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-white">Follow-up Alerts</h3>
              {totalAlerts > 0 && (
                <span style={{
                  fontSize: '11px', fontWeight: '600',
                  background: 'rgba(239,68,68,0.12)', color: '#f87171',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '20px', padding: '3px 10px',
                }}>
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

        {/* Status breakdown */}
        <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.22), transparent)',
          }} />
          <h3 className="font-display text-base font-semibold text-white mb-4">My Lead Status Breakdown</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {['New', 'Contacted', 'In Progress', 'Negotiation', 'Closed', 'Lost'].map((status) => {
              const count = leads.filter((l) => l.status === status).length;
              const accentColor = statusColors[status] || 'rgba(240,232,224,0.3)';
              return (
                <div
                  key={status}
                  className="text-center rounded-xl p-3"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(248,177,149,0.07)',
                  }}
                >
                  <div className="text-2xl font-bold font-display" style={{ color: accentColor }}>{count}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(240,232,224,0.4)' }}>{status}</div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
