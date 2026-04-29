'use client';
import { useState, useCallback } from 'react';

function getToken() {
  if (typeof window !== 'undefined') return localStorage.getItem('token');
  return null;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.score) params.set('score', filters.score);
      if (filters.source) params.set('source', filters.source);
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`/api/leads?${params.toString()}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setLeads(data.leads);
      else setError(data.message);
    } catch {
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const createLead = useCallback(async (leadData) => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(leadData),
    });
    return res.json();
  }, []);

  const updateLead = useCallback(async (id, updates) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  }, []);

  const deleteLead = useCallback(async (id) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    return res.json();
  }, []);

  const assignLead = useCallback(async (leadId, agentId) => {
    const res = await fetch('/api/assign', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ leadId, agentId }),
    });
    return res.json();
  }, []);

  return { leads, loading, error, fetchLeads, createLead, updateLead, deleteLead, assignLead };
}