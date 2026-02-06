'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Reservation } from '@/types';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await api.get('/api/reservations');
    if (error) {
      setError(error.message || 'Failed to load reservations');
      setLoading(false);
      return;
    }
    setReservations(data.items || []);
    setError('');
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Manage reservations</h1>
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">{error}</p>
            <Button variant="outline" onClick={fetchReservations}>Retry</Button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">No reservations found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">{reservation.name}</h3>
                  <p className="text-sm text-neutral-600">{reservation.date} at {reservation.time}</p>
                </div>
                <Button variant="outline">Confirm</Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
