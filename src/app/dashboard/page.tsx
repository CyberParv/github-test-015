'use client';

import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">Please sign in to view your dashboard.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Welcome back, {user.name}</h2>
              <p className="text-sm text-neutral-600">View your recent orders and saved details.</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Loyalty status</h2>
              <p className="text-sm text-neutral-600">Earn rewards with every coffee order.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
