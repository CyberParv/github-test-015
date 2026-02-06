'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { CartItem, CartLine } from '@/components/features/CartItem';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { api } from '@/lib/api';
import { useToast } from '@/providers/ToastProvider';

export default function CartPage() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const { toast } = useToast();

  const fetchCart = async () => {
    setLoading(true);
    const { data, error } = await api.get('/api/cart');
    if (error) {
      setError(error.message || 'Failed to load cart');
      setLoading(false);
      return;
    }
    setItems(data?.items || []);
    setError('');
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    const { error } = await api.post('/api/cart', { productId, quantity });
    if (error) {
      toast({ title: 'Update failed', description: error.message || 'Please try again.' });
      return;
    }
    fetchCart();
  };

  const removeItem = async (productId: string) => {
    const { error } = await api.post('/api/cart', { productId, quantity: 0 });
    if (error) {
      toast({ title: 'Remove failed', description: error.message || 'Please try again.' });
      return;
    }
    fetchCart();
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Your cart</h1>
        {loading ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
            <p className="text-sm text-neutral-600">Loading cart...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">{error}</p>
            <Button variant="outline" onClick={fetchCart}>Retry</Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
              ))}
            </div>
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">Order summary</h2>
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <label htmlFor="promo" className="text-sm font-medium text-neutral-700">Promo code</label>
                <Input id="promo" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="COFFEE10" />
                <Button variant="outline" className="w-full">Apply</Button>
              </div>
              <Button className="w-full">Proceed to checkout</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
