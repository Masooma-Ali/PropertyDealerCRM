'use client';
import { useState } from 'react';

const PROPERTY_TYPES = ['Residential', 'Commercial', 'Plot', 'Apartment', 'Villa', 'Other'];
const SOURCES = ['Facebook Ads', 'Walk-in', 'Website', 'Referral', 'Other'];
const STATUSES = ['New', 'Contacted', 'In Progress', 'Negotiation', 'Closed', 'Lost'];

export default function LeadForm({ initialData = {}, onSubmit, loading, isEdit = false }) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    propertyInterest: initialData.propertyInterest || 'Residential',
    budget: initialData.budget || '',
    source: initialData.source || 'Other',
    status: initialData.status || 'New',
    notes: initialData.notes || '',
    location: initialData.location || '',
    followUpDate: initialData.followUpDate
      ? new Date(initialData.followUpDate).toISOString().split('T')[0]
      : '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputClass =
    'w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Client name" />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="923001234567" />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="client@email.com" />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="DHA Phase 5, Lahore" />
        </div>
        <div>
          <label className={labelClass}>Property Interest *</label>
          <select name="propertyInterest" value={form.propertyInterest} onChange={handleChange} className={inputClass}>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Budget (PKR) *</label>
          <input name="budget" type="number" value={form.budget} onChange={handleChange} required className={inputClass} placeholder="e.g. 25000000 for 2.5Cr" />
        </div>
        <div>
          <label className={labelClass}>Source</label>
          <select name="source" value={form.source} onChange={handleChange} className={inputClass}>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {isEdit && (
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className={labelClass}>Follow-up Date</label>
          <input name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} className={inputClass} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className={inputClass} placeholder="Any additional notes about the lead..." />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
      </button>
    </form>
  );
}