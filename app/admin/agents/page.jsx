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

  function getToken() {
    return localStorage.getItem('token');
  }

  async function fetchAgents() {
    const res = await fetch('/api/agents', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (data.success) setAgents(data.agents);
    setLoading(false);
  }

  useEffect(() => { fetchAgents(); }, []);

  async function handleCreateAgent(e) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Agent created successfully');
      setForm({ name: '', email: '', password: '', phone: '' });
      setShowForm(false);
      fetchAgents();
    } else {
      toast.error(data.message || 'Failed to create agent');
    }
    setCreating(false);
  }

  const inputClass =
    'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition';

  return (
    <div>
      <Header title="Agents" />
      <div className="p-6 space-y-6">

        {/* Add Agent Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            {showForm ? '✕ Cancel' : '+ Add Agent'}
          </button>
        </div>

        {/* Add Agent Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Create New Agent</h3>
            <form onSubmit={handleCreateAgent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="Agent name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="agent@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                  placeholder="923001234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputClass}
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Agent'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Agents Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 animate-pulse">Loading agents...</div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">🧑‍💼</div>
              <p>No agents yet. Add your first agent above.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Agent', 'Email', 'Phone', 'Status', 'Joined'].map((h) => (
                    <th key={h} className="text-left text-gray-400 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{agent.email}</td>
                    <td className="px-4 py-3 text-gray-400">{agent.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(agent.createdAt).toLocaleDateString('en-PK')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}