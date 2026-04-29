'use client';
import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import LeadForm from '@/components/leads/LeadForm';
import Header from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewLeadPage() {
  const { createLead } = useLeads();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData) {
    setLoading(true);
    const result = await createLead(formData);
    if (result.success) {
      toast.success('Lead created successfully!');
      router.push('/admin/leads');
    } else {
      toast.error(result.message || 'Failed to create lead');
    }
    setLoading(false);
  }

  return (
    <div>
      <Header title="Add New Lead" />
      <div className="p-6 max-w-3xl">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <LeadForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}