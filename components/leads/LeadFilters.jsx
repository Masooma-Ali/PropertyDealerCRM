'use client';

export default function LeadFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        placeholder="Search by name, email, phone..."
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-64"
      />
      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
      >
        <option value="">All Status</option>
        {['New', 'Contacted', 'In Progress', 'Negotiation', 'Closed', 'Lost'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={filters.score || ''}
        onChange={(e) => onChange({ ...filters, score: e.target.value })}
        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
      >
        <option value="">All Priority</option>
        {['High', 'Medium', 'Low'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        value={filters.source || ''}
        onChange={(e) => onChange({ ...filters, source: e.target.value })}
        className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
      >
        <option value="">All Sources</option>
        {['Facebook Ads', 'Walk-in', 'Website', 'Referral', 'Other'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {(filters.status || filters.score || filters.source || filters.search) && (
        <button
          onClick={() => onChange({})}
          className="text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-500 transition"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}