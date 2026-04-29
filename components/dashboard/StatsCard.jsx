export default function StatsCard({ title, value, subtitle, icon, color = 'emerald', trend }) {
  const colors = {
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center text-lg ${colors[color]}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-300">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>}
    </div>
  );
}