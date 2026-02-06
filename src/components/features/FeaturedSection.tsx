import { MenuCard } from '@/components/features/MenuCard';
import type { Product } from '@/types';

interface FeaturedSectionProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export function FeaturedSection({ products, onAddToCart }: FeaturedSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-neutral-900">Featured favorites</h2>
        <span className="text-sm text-neutral-500">Top picks this week</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <MenuCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}
