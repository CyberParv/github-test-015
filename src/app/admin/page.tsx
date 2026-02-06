'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';

interface Stats {
  salesTotal: number;
  ordersCount: number;
  topProducts: { productId: string; sold: number }[];
  lowStock: { productId: string; inventoryCount: number }[];
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await api.get('/api/stats?range=30');
    if (error) {
      setError(error.message || 'Failed to load stats');
      setLoading(false);
      return;
    }
    setStats(data);
    setError('');
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Admin dashboard</h1>
        {!user ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">Please sign in with an admin account.</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">{error}</p>
            <Button variant="outline" onClick={fetchStats}>Retry</Button>
          </div>
        ) : !stats ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">No stats available.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-sm text-neutral-600">Sales total</h2>
              <p className="text-2xl font-semibold text-neutral-900">${stats.salesTotal.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-sm text-neutral-600">Orders</h2>
              <p className="text-2xl font-semibold text-neutral-900">{stats.ordersCount}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-sm text-neutral-600">Low stock</h2>
              <p className="text-2xl font-semibold text-neutral-900">{stats.lowStock.length}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
