'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import LeadStatusChart from '@/components/dashboard/LeadStatusChart';
import PriorityChart from '@/components/dashboard/PriorityChart';
import SourceChart from '@/components/dashboard/SourceChart';
import AgentPerformance from '@/components/dashboard/AgentPerformance';

/* ── Reusable card shell ── */
function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle warm top edge */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.2), transparent)',
      }} />
      {children}
    </div>
  );
}

/* ── Section heading inside a card ── */
function CardHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h3 className="font-display text-base font-semibold text-white leading-tight">{title}</h3>
      {subtitle && (
        <p className="text-xs mt-0.5" style={{ color: 'rgba(248,177,149,0.42)' }}>{subtitle}</p>
      )}
    </div>
  );
}

/* ── KPI card ── */
function KpiCard({ label, value, icon, accentColor }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(248,177,149,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
      }} />
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}22` }}
      >
        {icon}
      </div>
      <div>
        <div className="font-display text-2xl font-bold text-white leading-none">{value}</div>
        <div className="text-xs mt-1.5 font-medium" style={{ color: 'rgba(240,232,224,0.42)' }}>{label}</div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAnalytics(data.analytics);
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div>
        <Header title="Analytics" />
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card shimmer" style={{ height: '128px', borderRadius: '16px' }} />
          ))}
        </div>
      </div>
    );
  }

  const closedLeads = analytics?.statusDistribution?.find((s) => s._id === 'Closed')?.count || 0;
  const totalLeads = analytics?.totalLeads || 0;
  const closeRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  const kpis = [
    { label: 'Total Leads',   value: totalLeads, icon: '👥', accentColor: '#F8B195' },
    { label: 'Closed Leads',  value: closedLeads, icon: '✅', accentColor: '#34d399' },
    { label: 'Close Rate',    value: `${closeRate}%`, icon: '📊', accentColor: '#C06C84' },
    { label: 'Active Agents', value: analytics?.agentPerformance?.length || 0, icon: '🧑‍💼', accentColor: '#355C7D' },
  ];

  return (
    <div>
      <Header title="Analytics" subtitle="Performance overview across all leads and agents" />

      <div className="p-6 space-y-5">

        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader title="Status Distribution" subtitle="Breakdown of all leads by current status" />
            <LeadStatusChart data={analytics?.statusDistribution} />
          </Card>
          <Card>
            <CardHeader title="Priority Distribution" subtitle="Leads grouped by budget-based priority" />
            <PriorityChart data={analytics?.priorityDistribution} />
          </Card>
        </div>

        {/* Source chart */}
        <Card>
          <CardHeader title="Lead Sources" subtitle="Which channels are generating the most leads" />
          <SourceChart data={analytics?.sourceDistribution} />
        </Card>

        {/* Status breakdown table */}
        <Card>
          <CardHeader title="Status Breakdown" subtitle="Count and share of leads per status" />
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Status', 'Count', '% of Total', 'Bar'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: 'rgba(248,177,149,0.42)', letterSpacing: '0.1em' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics?.statusDistribution?.map((item) => {
                const pct = totalLeads > 0 ? ((item.count / totalLeads) * 100).toFixed(1) : 0;
                return (
                  <tr key={item._id} style={{ borderBottom: '1px solid rgba(248,177,149,0.05)' }}>
                    <td className="px-4 py-3 text-white font-medium">{item._id}</td>
                    <td className="px-4 py-3 font-bold font-display" style={{ color: '#F8B195' }}>{item.count}</td>
                    <td className="px-4 py-3" style={{ color: 'rgba(240,232,224,0.42)' }}>{pct}%</td>
                    <td className="px-4 py-3 w-48">
                      <div className="rounded-full h-1.5" style={{ background: 'rgba(248,177,149,0.08)' }}>
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #C06C84, #F8B195)' }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader title="Agent Performance" subtitle="Detailed view of each agent's lead handling" />
          <AgentPerformance data={analytics?.agentPerformance} />
        </Card>

      </div>
    </div>
  );
}
