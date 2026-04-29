export default function Badge({ label, type }) {
  const styles = {
    High: 'bg-red-500/20 text-red-400 border border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border border-green-500/30',
    New: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    Contacted: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    'In Progress': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    Negotiation: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    Closed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    Lost: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  };

  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[label] || 'bg-gray-700 text-gray-300'}`}>
      {label}
    </span>
  );
}