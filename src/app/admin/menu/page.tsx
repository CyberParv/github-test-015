'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import type { Product } from '@/types';

export default function AdminMenuPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMenu = async () => {
    setLoading(true);
    const { data, error } = await api.get('/api/menu?limit=20');
    if (error) {
      setError(error.message || 'Failed to load menu');
      setLoading(false);
      return;
    }
    setItems(data.items || []);
    setError('');
    setLoading(false);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-900">Manage menu</h1>
          <Button>Add product</Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">{error}</p>
            <Button variant="outline" onClick={fetchMenu}>Retry</Button>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">No products found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">{item.name}</h3>
                  <p className="text-sm text-neutral-600">${item.price?.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Edit</Button>
                  <Button variant="outline">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
