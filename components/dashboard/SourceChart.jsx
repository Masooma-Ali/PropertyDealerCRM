'use client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

export default function SourceChart({ data }) {
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
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} barSize={36} layout="vertical">
        <XAxis
          type="number"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={90}
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
        <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}