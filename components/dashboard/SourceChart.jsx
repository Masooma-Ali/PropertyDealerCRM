'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1C1B27', border: '1px solid rgba(160,210,235,0.15)', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>{label}</p>
        <p style={{ color: '#A0D2EB', fontSize: '12px' }}>{payload[0].value} leads</p>
      </div>
    );
  }
  return null;
};

export default function SourceChart({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', color: 'rgba(229,234,245,0.3)', fontSize: '14px' }}>No data available</div>;
  }

  const chartData = data.map(item => ({ name: item._id, count: item.count }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} barSize={28} layout="vertical">
        <XAxis type="number" tick={{ fill: 'rgba(229,234,245,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(229,234,245,0.5)', fontSize: 11, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} width={88} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
        <Bar dataKey="count" fill="#8459B3" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}