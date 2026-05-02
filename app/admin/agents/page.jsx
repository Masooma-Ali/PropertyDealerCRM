'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import toast from 'react-hot-toast';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [creating, setCreating] = useState(false);

  const getToken = () => localStorage.getItem('token');

  async function fetchAgents() {
    const res = await fetch('/api/agents', { headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    if (data.success) setAgents(data.agents);
    setLoading(false);
  }

  useEffect(() => { fetchAgents(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Agent created');
      setForm({ name: '', email: '', password: '', phone: '' });
      setShowForm(false);
      fetchAgents();
    } else toast.error(data.message || 'Failed to create agent');
    setCreating(false);
  }

  return (
    <div>
      <Header title="Agents" subtitle="Manage your sales team" />

      <div style={{ padding: '28px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ padding: '10px 20px' }}>
            {showForm ? '✕ Cancel' : '+ Add Agent'}
          </button>
        </div>

        {/* Add Agent form */}
        {showForm && (
          <div
            className="card"
            style={{ padding: '24px', marginBottom: '24px', borderColor: 'rgba(192,108,132,0.28)', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, #C06C84, #F8B195)',
              opacity: 0.5,
            }} />
            <div className="font-display" style={{ color: 'white', fontWeight: '600', fontSize: '18px', marginBottom: '20px' }}>
              Create New Agent
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-base" placeholder="Agent name" />
                </div>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-base" placeholder="agent@example.com" />
                </div>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-base" placeholder="923001234567" />
                </div>
                <div>
                  <label className="section-label" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
                  <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-base" placeholder="Min 6 characters" />
                </div>
              </div>
              <button type="submit" disabled={creating} className="btn-primary" style={{ padding: '10px 24px' }}>
                {creating ? 'Creating...' : 'Create Agent'}
              </button>
            </form>
          </div>
        )}

        {/* Agents grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card shimmer" style={{ height: '140px' }} />
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(240,232,224,0.3)' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, rgba(192,108,132,0.15), rgba(248,177,149,0.08))',
              border: '1px solid rgba(192,108,132,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
            }}>
              🧑‍💼
            </div>
            <div style={{ fontSize: '14px' }}>No agents yet. Add your first agent above.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {agents.map(agent => (
              <div
                key={agent._id}
                className="card"
                style={{ padding: '20px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s, transform 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(192,108,132,0.32)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Top accent */}
                <div style={{
                  position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(248,177,149,0.22), transparent)',
                }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #C06C84, #F8B195)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '18px', color: 'white',
                    fontFamily: 'Cormorant Garamond, serif',
                    boxShadow: '0 4px 12px rgba(192,108,132,0.3)',
                  }}>
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{agent.name}</div>
                    <div style={{ color: 'rgba(248,177,149,0.5)', fontSize: '12px' }}>{agent.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(240,232,224,0.32)', fontSize: '12px' }}>
                    {agent.phone || 'No phone'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 4px rgba(52,211,153,0.5)' }} />
                    <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '600' }}>Active</span>
                  </div>
                </div>
                <div style={{
                  marginTop: '12px', paddingTop: '12px',
                  borderTop: '1px solid rgba(248,177,149,0.07)',
                  fontSize: '11px', color: 'rgba(240,232,224,0.28)',
                }}>
                  Joined {new Date(agent.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
