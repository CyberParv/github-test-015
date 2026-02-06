import { Navigation } from '@/components/layout/Navigation';
import { MenuCard } from '@/components/features/MenuCard';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';

interface MenuPageProps {
  searchParams?: {
    category?: string;
    q?: string;
    page?: string;
  };
}

async function getMenu(params: MenuPageProps['searchParams']) {
  const query = new URLSearchParams({
    page: params?.page || '1',
    limit: '12',
    category: params?.category || '',
    q: params?.q || '',
  });
  const { data, error } = await api.get(`/api/menu?${query.toString()}`);
  if (error) throw new Error(error.message || 'Failed to load menu');
  return data as { items: Product[]; total: number; page: number; limit: number };
}

async function getCategories() {
  const { data, error } = await api.get('/api/categories');
  if (error) throw new Error(error.message || 'Failed to load categories');
  return data as Category[];
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  let menuData: { items: Product[]; total: number; page: number; limit: number } | null = null;
  let categories: Category[] = [];
  let hasError = false;

  try {
    [menuData, categories] = await Promise.all([getMenu(searchParams), getCategories()]);
  } catch {
    hasError = true;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-neutral-900">Our Menu</h1>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">All</Button>
            {categories.map((category) => (
              <Button key={category.id} variant="outline">
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        {hasError ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">Unable to load menu items.</p>
            <Button variant="outline">Retry</Button>
          </div>
        ) : !menuData ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
            <p className="text-sm text-neutral-600">Loading menu...</p>
          </div>
        ) : menuData.items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">No items match your filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuData.items.map((item) => (
              <MenuCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
