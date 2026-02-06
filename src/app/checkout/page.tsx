'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await api.post('/api/checkout', {
      customer: form,
    });
    setLoading(false);
    if (error) {
      setError(error.message || 'Checkout failed');
      toast({ title: 'Checkout failed', description: error.message || 'Please try again.' });
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
        {submitted ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-green-700">Order confirmed!</h2>
            <p className="text-sm text-green-700">We have emailed your confirmation and receipt.</p>
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-neutral-700" htmlFor="name">Full name</label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700" htmlFor="email">Email</label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-neutral-700" htmlFor="address">Address</label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700" htmlFor="city">City</label>
                <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700" htmlFor="postal">Postal code</label>
                <Input id="postal" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? <Spinner /> : 'Place order'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
