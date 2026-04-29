'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import LeadStatusChart from '@/components/dashboard/LeadStatusChart';
import PriorityChart from '@/components/dashboard/PriorityChart';
import SourceChart from '@/components/dashboard/SourceChart';
import AgentPerformance from '@/components/dashboard/AgentPerformance';

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
        <div className="p-6 text-gray-400 animate-pulse">Loading analytics...</div>
      </div>
    );
  }

  // Helper to sum distribution counts
  function totalFromDist(dist) {
    return dist?.reduce((acc, d) => acc + d.count, 0) || 0;
  }

  const closedLeads = analytics?.statusDistribution?.find((s) => s._id === 'Closed')?.count || 0;
  const totalLeads = analytics?.totalLeads || 0;
  const closeRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : 0;

  return (
    <div>
      <Header title="Analytics" />
      <div className="p-6 space-y-6">

        {/* Summary KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Leads', value: totalLeads, icon: '👥', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
            { label: 'Closed Leads', value: closedLeads, icon: '✅', bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
            { label: 'Close Rate', value: `${closeRate}%`, icon: '📊', bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
            { label: 'Active Agents', value: analytics?.agentPerformance?.length || 0, icon: '🧑‍💼', bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
          ].map((kpi) => (
            <div key={kpi.label} className={`border rounded-xl p-5 ${kpi.bg}`}>
              <div className="text-2xl mb-2">{kpi.icon}</div>
              <div className="text-3xl font-bold text-white">{kpi.value}</div>
              <div className="text-sm mt-0.5 opacity-80">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Status Distribution</h3>
            <p className="text-gray-500 text-xs mb-4">Breakdown of all leads by current status</p>
            <LeadStatusChart data={analytics?.statusDistribution} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Priority Distribution</h3>
            <p className="text-gray-500 text-xs mb-4">Leads grouped by budget-based priority</p>
            <PriorityChart data={analytics?.priorityDistribution} />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Lead Sources</h3>
          <p className="text-gray-500 text-xs mb-4">Which channels are generating the most leads</p>
          <SourceChart data={analytics?.sourceDistribution} />
        </div>

        {/* Status breakdown table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Status Breakdown Table</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 font-medium px-4 py-2">Status</th>
                <th className="text-left text-gray-400 font-medium px-4 py-2">Count</th>
                <th className="text-left text-gray-400 font-medium px-4 py-2">% of Total</th>
                <th className="text-left text-gray-400 font-medium px-4 py-2">Bar</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.statusDistribution?.map((item) => {
                const pct = totalLeads > 0 ? ((item.count / totalLeads) * 100).toFixed(1) : 0;
                return (
                  <tr key={item._id} className="border-b border-gray-800/50">
                    <td className="px-4 py-2.5 text-white">{item._id}</td>
                    <td className="px-4 py-2.5 text-gray-300 font-semibold">{item.count}</td>
                    <td className="px-4 py-2.5 text-gray-400">{pct}%</td>
                    <td className="px-4 py-2.5 w-48">
                      <div className="bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Agent Performance */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-1">Agent Performance</h3>
          <p className="text-gray-500 text-xs mb-4">Detailed view of each agent's lead handling</p>
          <AgentPerformance data={analytics?.agentPerformance} />
        </div>

      </div>
    </div>
  );
}