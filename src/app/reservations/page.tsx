'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

export default function ReservationsPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '', guests: 2 });
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    const { error } = await api.post('/api/reservations', form);
    setLoading(false);
    if (error) {
      toast({ title: 'Reservation failed', description: error.message || 'Please try again.' });
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Reserve a table</h1>
        {submitted ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-green-700">Reservation confirmed</h2>
            <p className="text-sm text-green-700">We look forward to serving you.</p>
          </div>
        ) : (
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-neutral-700">Name</label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="date" className="text-sm font-medium text-neutral-700">Date</label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label htmlFor="time" className="text-sm font-medium text-neutral-700">Time</label>
                <Input id="time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div>
              <label htmlFor="guests" className="text-sm font-medium text-neutral-700">Guests</label>
              <Input id="guests" type="number" min={1} value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? <Spinner /> : 'Reserve'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
