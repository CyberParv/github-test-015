'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/providers/ToastProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({ title: 'Reset link sent', description: 'Check your email for reset instructions.' });
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Reset password</h1>
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Send reset link</Button>
        </div>
      </main>
    </div>
  );
}
