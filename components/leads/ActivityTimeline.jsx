'use client';
import { useEffect, useState } from 'react';

const actionIcons = {
  created: '🟢',
  status_updated: '🔄',
  assigned: '👤',
  reassigned: '🔀',
  notes_updated: '📝',
  follow_up_set: '📅',
  priority_changed: '⚡',
  contacted: '📞',
};

export default function ActivityTimeline({ leadId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leads/${leadId}/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setActivities(data.activities);
      setLoading(false);
    }
    if (leadId) fetchActivities();
  }, [leadId]);

  if (loading) return <p className="text-gray-400 text-sm">Loading activity...</p>;
  if (activities.length === 0) return <p className="text-gray-500 text-sm">No activity yet.</p>;

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity._id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="text-lg">{actionIcons[activity.action] || '📌'}</div>
            {index < activities.length - 1 && (
              <div className="w-px flex-1 bg-gray-700 mt-1" />
            )}
          </div>
          <div className="pb-4 flex-1">
            <p className="text-white text-sm font-medium">{activity.description}</p>
            <p className="text-gray-500 text-xs mt-0.5">
              by <span className="text-gray-400">{activity.performedBy?.name}</span>
              {' · '}
              {new Date(activity.createdAt).toLocaleString('en-PK')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}