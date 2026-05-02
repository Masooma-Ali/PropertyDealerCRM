'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  New: '#A0D2EB', Contacted: '#D0B0F4', 'In Progress': '#fb923c',
  Negotiation: '#8459B3', Closed: '#34d399', Lost: '#494D5F',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1C1B27', border: '1px solid rgba(160,210,235,0.15)', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{payload[0].name}</p>
        <p style={{ color: '#A0D2EB', fontSize: '13px' }}>{payload[0].value} leads</p>
      </div>
    );
  }
  return null;
};

export default function LeadStatusChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '220px', color: 'rgba(229,234,245,0.3)', fontSize: '14px' }}>
        No data available
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item._id, value: item.count, color: STATUS_COLORS[item._id] || '#494D5F',
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
          paddingAngle={3} dataKey="value" strokeWidth={0}>
          {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={7}
          formatter={v => <span style={{ color: 'rgba(229,234,245,0.6)', fontSize: '12px' }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}