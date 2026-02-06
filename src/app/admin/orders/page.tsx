'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await api.get('/api/orders?limit=20');
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
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Manage orders</h1>
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
            <p className="text-sm text-neutral-600">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">Order #{order.id}</h3>
                  <p className="text-sm text-neutral-600">Status: {order.status}</p>
                </div>
                <Button variant="outline">Update status</Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
