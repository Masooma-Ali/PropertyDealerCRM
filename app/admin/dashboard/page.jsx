'use client';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import StatsCard from '@/components/dashboard/StatsCard';
import LeadStatusChart from '@/components/dashboard/LeadStatusChart';
import PriorityChart from '@/components/dashboard/PriorityChart';
import SourceChart from '@/components/dashboard/SourceChart';
import AgentPerformance from '@/components/dashboard/AgentPerformance';
import FollowUpAlerts from '@/components/dashboard/FollowUpAlerts';
import { useSocket } from '@/hooks/useSocket';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [followUps, setFollowUps] = useState({ overdue: [], upcoming: [], stale: [] });
  const [loading, setLoading] = useState(true);

  function getToken() {
    return localStorage.getItem('token');
  }

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
    } catch {
      console.error('Failed to fetch analytics');
    }
  }

  async function fetchFollowUps() {
    try {
      const res = await fetch('/api/followups', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (data.success) setFollowUps(data);
    } catch {
      console.error('Failed to fetch follow-ups');
    }
  }

  useEffect(() => {
    async function init() {
      await Promise.all([fetchAnalytics(), fetchFollowUps()]);
      setLoading(false);
    }
    init();
  }, []);

  // Real-time: refresh analytics on lead events
  useSocket(useCallback((event) => {
    if (['lead:created', 'lead:updated', 'lead:assignment-changed'].includes(event)) {
      fetchAnalytics();
      fetchFollowUps();
      toast.success('Dashboard updated');
    }
  }, []));

  if (loading) {
    return (
      <div>
        <Header title="Admin Dashboard" />
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse h-28" />
          ))}
        </div>
      </div>
    );
  }

  const totalAlerts =
    (followUps.overdue?.length || 0) +
    (followUps.upcoming?.length || 0) +
    (followUps.stale?.length || 0);

  return (
    <div>
      <Header title="Admin Dashboard" />
      <div className="p-6 space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Leads"
            value={analytics?.totalLeads || 0}
            icon="👥"
            color="emerald"
            subtitle="All time"
          />
          <StatsCard
            title="New This Week"
            value={analytics?.recentLeads || 0}
            icon="📥"
            color="blue"
            subtitle="Last 7 days"
          />
          <StatsCard
            title="Unassigned"
            value={analytics?.unassignedLeads || 0}
            icon="⚠️"
            color="yellow"
            subtitle="Needs attention"
          />
          <StatsCard
            title="High Priority New"
            value={analytics?.highPriorityNew || 0}
            icon="🔴"
            color="red"
            subtitle="Urgent leads"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Lead Status</h3>
            <p className="text-gray-500 text-xs mb-4">Distribution by status</p>
            <LeadStatusChart data={analytics?.statusDistribution} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Priority Levels</h3>
            <p className="text-gray-500 text-xs mb-4">High / Medium / Low</p>
            <PriorityChart data={analytics?.priorityDistribution} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Lead Sources</h3>
            <p className="text-gray-500 text-xs mb-4">Where leads come from</p>
            <SourceChart data={analytics?.sourceDistribution} />
          </div>
        </div>

        {/* Bottom Row: Agent Performance + Follow-ups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Agent Performance</h3>
            <p className="text-gray-500 text-xs mb-4">Lead handling overview</p>
            <AgentPerformance data={analytics?.agentPerformance} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-semibold">Follow-up Alerts</h3>
              {totalAlerts > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold">
                  {totalAlerts} alerts
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs mb-4">Overdue, upcoming & stale leads</p>
            <FollowUpAlerts
              overdue={followUps.overdue}
              upcoming={followUps.upcoming}
              stale={followUps.stale}
              role="admin"
            />
          </div>
        </div>

      </div>
    </div>
  );
}