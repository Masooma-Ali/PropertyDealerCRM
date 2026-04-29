'use client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const PRIORITY_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
};

export default function PriorityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
        No data available
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item._id,
    count: item.count,
    color: PRIORITY_COLORS[item._id] || '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} barSize={48}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#f9fafb',
            fontSize: '13px',
          }}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}