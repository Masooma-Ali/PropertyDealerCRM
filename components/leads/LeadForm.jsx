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
      ? new Date(initialData.followUpDate).toISOString().split('T')[0] : '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'rgba(160,210,235,0.55)', marginBottom: '8px',
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Section: Client Info */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(132,89,179,0.7)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid rgba(132,89,179,0.15)' }}>
          Client Information
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-base" placeholder="Client full name" />
          </div>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input-base" placeholder="923001234567" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-base" placeholder="client@email.com" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Location / Area</label>
            <input name="location" value={form.location} onChange={handleChange} className="input-base" placeholder="DHA Phase 5, Lahore" />
          </div>
        </div>
      </div>

      {/* Section: Property Details */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(160,210,235,0.55)', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid rgba(160,210,235,0.08)' }}>
          Property Details
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Property Interest *</label>
            <select name="propertyInterest" value={form.propertyInterest} onChange={handleChange} className="input-base">
              {PROPERTY_TYPES.map(t => <option key={t} value={t} style={{ background: '#1C1B27' }}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Budget (PKR) *</label>
            <input name="budget" type="number" value={form.budget} onChange={handleChange} required className="input-base" placeholder="e.g. 25000000" />
          </div>
          <div>
            <label style={labelStyle}>Lead Source</label>
            <select name="source" value={form.source} onChange={handleChange} className="input-base">
              {SOURCES.map(s => <option key={s} value={s} style={{ background: '#1C1B27' }}>{s}</option>)}
            </select>
          </div>
          {isEdit && (
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-base">
                {STATUSES.map(s => <option key={s} value={s} style={{ background: '#1C1B27' }}>{s}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={labelStyle}>Follow-up Date</label>
            <input name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} className="input-base" />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '28px' }}>
        <label style={labelStyle}>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} className="input-base"
          style={{ resize: 'vertical', minHeight: '100px' }}
          placeholder="Any additional information about this lead..." />
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 28px' }}>
          {loading
            ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg className="animate-spin" style={{ width: '15px', height: '15px' }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Saving...
              </span>
            : isEdit ? 'Update Lead' : 'Create Lead →'
          }
        </button>
      </div>
    </form>
  );
}