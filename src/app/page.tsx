import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/features/HeroSection';
import { FeaturedSection } from '@/components/features/FeaturedSection';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { Product } from '@/types';

async function getFeatured() {
  const { data, error } = await api.get('/api/featured');
  if (error) {
    throw new Error(error.message || 'Failed to load featured products');
  }
  return data as Product[];
}

export default async function HomePage() {
  let featured: Product[] = [];
  let hasError = false;

  try {
    featured = await getFeatured();
  } catch {
    hasError = true;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
        <HeroSection />
        {hasError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">Unable to load featured items.</p>
            <Button variant="outline">Retry</Button>
          </div>
        ) : featured.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
            <p className="text-sm text-neutral-600">Loading featured items...</p>
          </div>
        ) : (
          <FeaturedSection products={featured} />
        )}
        <section className="grid gap-6 rounded-3xl bg-white p-8 shadow-sm md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Freshly roasted</h3>
            <p className="text-sm text-neutral-600">Small-batch coffee roasted daily for peak flavor.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Fast delivery</h3>
            <p className="text-sm text-neutral-600">Get your favorites delivered or ready for pickup.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Loyalty rewards</h3>
            <p className="text-sm text-neutral-600">Earn points on every order and unlock perks.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
