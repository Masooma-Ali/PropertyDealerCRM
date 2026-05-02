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

  const getToken = () => localStorage.getItem('token');

  async function fetchAnalytics() {
    const res = await fetch('/api/analytics', { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    if (data.success) setAnalytics(data.analytics);
  }

  async function fetchFollowUps() {
    const res = await fetch('/api/followups', { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    if (data.success) setFollowUps(data);
  }

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchFollowUps()]).finally(() => setLoading(false));
  }, []);

  useSocket(useCallback((event) => {
    if (['lead:created', 'lead:updated', 'lead:assignment-changed'].includes(event)) {
      fetchAnalytics(); fetchFollowUps();
      toast.success('Dashboard updated');
    }
  }, []));

  const totalAlerts = (followUps.overdue?.length || 0) + (followUps.upcoming?.length || 0) + (followUps.stale?.length || 0);

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" subtitle="Overview of your CRM" />
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card shimmer" style={{ height: '120px', borderRadius: '16px' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" subtitle="Real-time overview of your property CRM" />

      <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
          <StatsCard title="Total Leads" value={analytics?.totalLeads || 0} icon="👥" color="violet" subtitle="All time" />
          <StatsCard title="This Week" value={analytics?.recentLeads || 0} icon="📈" color="sky" subtitle="Last 7 days" />
          <StatsCard title="Unassigned" value={analytics?.unassignedLeads || 0} icon="⚠️" color="amber" subtitle="Need assignment" />
          <StatsCard title="Urgent" value={analytics?.highPriorityNew || 0} icon="🔴" color="red" subtitle="High priority, new" />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          {[
            { title: 'Lead Status', subtitle: 'By current stage', Chart: LeadStatusChart, data: analytics?.statusDistribution },
            { title: 'Priority Levels', subtitle: 'High · Medium · Low', Chart: PriorityChart, data: analytics?.priorityDistribution },
            { title: 'Lead Sources', subtitle: 'Where leads come from', Chart: SourceChart, data: analytics?.sourceDistribution },
          ].map(({ title, subtitle, Chart, data }) => (
            <div key={title} className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
              {/* Warm accent top edge */}
              <div style={{
                position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.22), transparent)',
              }} />
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '15px', fontFamily: 'Cormorant Garamond, serif' }}>{title}</div>
                <div style={{ color: 'rgba(248,177,149,0.42)', fontSize: '12px', marginTop: '2px' }}>{subtitle}</div>
              </div>
              <Chart data={data} />
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.22), transparent)',
            }} />
            <div style={{ marginBottom: '16px' }}>
              <div style={{ color: 'white', fontWeight: '600', fontSize: '15px', fontFamily: 'Cormorant Garamond, serif' }}>Agent Performance</div>
              <div style={{ color: 'rgba(248,177,149,0.42)', fontSize: '12px', marginTop: '2px' }}>Lead handling overview</div>
            </div>
            <AgentPerformance data={analytics?.agentPerformance} />
          </div>

          <div className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.22), transparent)',
            }} />
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '15px', fontFamily: 'Cormorant Garamond, serif' }}>Follow-up Alerts</div>
                <div style={{ color: 'rgba(248,177,149,0.42)', fontSize: '12px', marginTop: '2px' }}>Overdue · Upcoming · Stale</div>
              </div>
              {totalAlerts > 0 && (
                <span style={{
                  background: 'rgba(239,68,68,0.12)', color: '#f87171',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: '20px',
                  padding: '3px 10px', fontSize: '11px', fontWeight: '600',
                }}>
                  {totalAlerts} alerts
                </span>
              )}
            </div>
            <FollowUpAlerts overdue={followUps.overdue} upcoming={followUps.upcoming} stale={followUps.stale} role="admin" />
          </div>
        </div>

      </div>
    </div>
  );
}
