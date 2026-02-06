'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const { toast } = useToast();

  const handleSignup = async () => {
    setLoading(true);
    const { data, error } = await api.post('/api/auth/signup', form);
    setLoading(false);
    if (error) {
      toast({ title: 'Signup failed', description: error.message || 'Please try again.' });
      return;
    }
    setUser(data.user);
    toast({ title: 'Account created', description: 'Welcome to the coffee club.' });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create account</h1>
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-neutral-700">Name</label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-neutral-700">Password</label>
            <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <Button className="w-full" onClick={handleSignup} disabled={loading}>Create account</Button>
        </div>
      </main>
    </div>
  );
}
