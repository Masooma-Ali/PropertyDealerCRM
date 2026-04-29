'use client';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const STATUS_COLORS = {
  New: '#3b82f6',
  Contacted: '#a855f7',
  'In Progress': '#f97316',
  Negotiation: '#06b6d4',
  Closed: '#10b981',
  Lost: '#6b7280',
};

export default function LeadStatusChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item._id,
    value: item.count,
    color: STATUS_COLORS[item._id] || '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#f9fafb',
            fontSize: '13px',
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}