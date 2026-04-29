'use client';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function LeadTable({ leads, role, onDelete, onAssign, agents }) {
  function formatBudget(budget) {
    if (budget >= 10_000_000) return `${(budget / 10_000_000).toFixed(1)}Cr`;
    if (budget >= 100_000) return `${(budget / 100_000).toFixed(1)}L`;
    return budget.toLocaleString();
  }

  function whatsappLink(phone) {
    if (!phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="text-5xl mb-3">📭</div>
        <p>No leads found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {['Name', 'Contact', 'Interest', 'Budget', 'Priority', 'Status', 'Source', 'Assigned To', 'Actions'].map((h) => (
              <th key={h} className="text-left text-gray-400 font-medium px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
              <td className="px-4 py-3">
                <div className="font-medium text-white">{lead.name}</div>
                <div className="text-gray-500 text-xs">{lead.location || '—'}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-gray-300 text-xs">{lead.email || '—'}</div>
                {lead.phone && (
                  <a
                    href={whatsappLink(lead.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 text-xs hover:underline flex items-center gap-1 mt-0.5"
                  >
                    💬 {lead.phone}
                  </a>
                )}
              </td>
              <td className="px-4 py-3 text-gray-300">{lead.propertyInterest}</td>
              <td className="px-4 py-3 text-gray-300 font-mono">
                PKR {formatBudget(lead.budget)}
              </td>
              <td className="px-4 py-3">
                <Badge label={lead.score} />
              </td>
              <td className="px-4 py-3">
                <Badge label={lead.status} />
              </td>
              <td className="px-4 py-3 text-gray-400">{lead.source}</td>
              <td className="px-4 py-3">
                {role === 'admin' && agents ? (
                  <select
                    defaultValue={lead.assignedTo?._id || ''}
                    onChange={(e) => onAssign && onAssign(lead._id, e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-gray-400 text-xs">
                    {lead.assignedTo?.name || 'Unassigned'}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${role}/leads/${lead._id}`}
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    View
                  </Link>
                  {role === 'admin' && (
                    <button
                      onClick={() => onDelete && onDelete(lead._id)}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}