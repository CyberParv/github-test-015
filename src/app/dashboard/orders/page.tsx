'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { OrderCard } from '@/components/features/OrderCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data, error } = await api.get(`/api/orders?userId=${user.id}`);
    if (error) {
      setError(error.message || 'Failed to load orders');
      setLoading(false);
      return;
    }
    setOrders(data.items || []);
    setError('');
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Order history</h1>
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">{error}</p>
            <Button variant="outline" onClick={fetchOrders}>Retry</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">No orders yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
