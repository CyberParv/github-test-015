'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const handleSave = async () => {
    if (!user?.id) return;
    const { data, error } = await api.put(`/api/users/${user.id}`, form);
    if (error) {
      toast({ title: 'Update failed', description: error.message || 'Please try again.' });
      return;
    }
    setUser(data);
    toast({ title: 'Profile updated', description: 'Your details have been saved.' });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Profile settings</h1>
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-neutral-700">Name</label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-neutral-700">Phone</label>
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </main>
    </div>
  );
}
