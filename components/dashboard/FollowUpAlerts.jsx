'use client';
import Link from 'next/link';

export default function FollowUpAlerts({ overdue = [], upcoming = [], stale = [], role = 'admin' }) {
  const basePath = `/${role}/leads`;

  if (overdue.length === 0 && upcoming.length === 0 && stale.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        ✅ No follow-up alerts right now
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {overdue.length > 0 && (
        <div>
          <h4 className="text-red-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>🔴</span> Overdue Follow-ups ({overdue.length})
          </h4>
          <div className="space-y-2">
            {overdue.slice(0, 5).map((lead) => (
              <Link
                key={lead._id}
                href={`${basePath}/${lead._id}`}
                className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 hover:bg-red-500/20 transition group"
              >
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-red-300 transition">{lead.name}</p>
                  <p className="text-red-400 text-xs">
                    Due: {new Date(lead.followUpDate).toLocaleDateString('en-PK')}
                  </p>
                </div>
                <span className="text-red-400 text-xs font-semibold px-2 py-0.5 bg-red-500/20 rounded-full">
                  Overdue
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h4 className="text-yellow-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>🟡</span> Upcoming Follow-ups ({upcoming.length})
          </h4>
          <div className="space-y-2">
            {upcoming.slice(0, 5).map((lead) => (
              <Link
                key={lead._id}
                href={`${basePath}/${lead._id}`}
                className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 hover:bg-yellow-500/20 transition group"
              >
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-yellow-300 transition">{lead.name}</p>
                  <p className="text-yellow-400 text-xs">
                    Due: {new Date(lead.followUpDate).toLocaleDateString('en-PK')}
                  </p>
                </div>
                <span className="text-yellow-400 text-xs font-semibold px-2 py-0.5 bg-yellow-500/20 rounded-full">
                  Soon
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {stale.length > 0 && (
        <div>
          <h4 className="text-gray-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>⚫</span> Stale Leads — No Activity 7d+ ({stale.length})
          </h4>
          <div className="space-y-2">
            {stale.slice(0, 5).map((lead) => (
              <Link
                key={lead._id}
                href={`${basePath}/${lead._id}`}
                className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-700 transition group"
              >
                <div>
                  <p className="text-white text-sm font-medium group-hover:text-gray-300 transition">{lead.name}</p>
                  <p className="text-gray-500 text-xs">
                    Last active: {new Date(lead.lastActivityAt).toLocaleDateString('en-PK')}
                  </p>
                </div>
                <span className="text-gray-400 text-xs font-semibold px-2 py-0.5 bg-gray-700 rounded-full">
                  Stale
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}