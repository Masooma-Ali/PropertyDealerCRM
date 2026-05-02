'use client';
import { useEffect, useState } from 'react';

const actionConfig = {
  created:        { icon: '🏠', color: '#34d399', label: 'Lead Created' },
  status_updated: { icon: '🔄', color: '#A0D2EB', label: 'Status Updated' },
  assigned:       { icon: '👤', color: '#D0B0F4', label: 'Assigned' },
  reassigned:     { icon: '🔀', color: '#8459B3', label: 'Reassigned' },
  notes_updated:  { icon: '📝', color: '#fbbf24', label: 'Notes Updated' },
  follow_up_set:  { icon: '📅', color: '#fb923c', label: 'Follow-up Set' },
  priority_changed:{ icon: '⚡', color: '#f87171', label: 'Priority Changed' },
  contacted:      { icon: '📞', color: '#A0D2EB', label: 'Contacted' },
};

export default function ActivityTimeline({ leadId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leads/${leadId}/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setActivities(data.activities);
      setLoading(false);
    }
    if (leadId) fetch_();
  }, [leadId]);

  if (loading) return <div style={{ color: 'rgba(229,234,245,0.4)', fontSize: '14px', padding: '16px 0' }}>Loading activity...</div>;
  if (!activities.length) return <div style={{ color: 'rgba(229,234,245,0.3)', fontSize: '14px', padding: '16px 0' }}>No activity recorded yet.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {activities.map((activity, i) => {
        const cfg = actionConfig[activity.action] || { icon: '📌', color: '#A0D2EB', label: activity.action };
        const isLast = i === activities.length - 1;

        return (
          <div key={activity._id} style={{ display: 'flex', gap: '14px' }}>
            {/* Timeline line + dot */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: `${cfg.color}18`, border: `1.5px solid ${cfg.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              }}>
                {cfg.icon}
              </div>
              {!isLast && (
                <div style={{ width: '1px', flex: '1', background: 'rgba(160,210,235,0.1)', margin: '4px 0', minHeight: '20px' }} />
              )}
            </div>

            {/* Content */}
            <div style={{ paddingBottom: isLast ? '0' : '20px', flex: 1, paddingTop: '4px' }}>
              <div style={{ color: 'white', fontSize: '13.5px', fontWeight: '500', marginBottom: '3px' }}>
                {activity.description}
              </div>
              <div style={{ color: 'rgba(229,234,245,0.35)', fontSize: '11px' }}>
                by{' '}
                <span style={{ color: 'rgba(160,210,235,0.6)' }}>{activity.performedBy?.name}</span>
                {'  ·  '}
                {new Date(activity.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}