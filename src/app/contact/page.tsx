'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/providers/ToastProvider';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({ title: 'Message sent', description: 'We will get back to you soon.' });
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Contact us</h1>
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
            <label htmlFor="message" className="text-sm font-medium text-neutral-700">Message</label>
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="min-h-[120px] w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Send message</Button>
        </div>
      </main>
    </div>
  );
}
