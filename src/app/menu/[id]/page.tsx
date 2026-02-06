import { Navigation } from '@/components/layout/Navigation';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { ReviewCard } from '@/components/features/ReviewCard';
import type { Product, Review } from '@/types';

interface ProductPageProps {
  params: { id: string };
}

async function getProduct(id: string) {
  const { data, error } = await api.get(`/api/menu/${id}`);
  if (error) throw new Error(error.message || 'Failed to load product');
  return data as Product;
}

async function getReviews(id: string) {
  const { data, error } = await api.get(`/api/reviews?productId=${id}`);
  if (error) throw new Error(error.message || 'Failed to load reviews');
  return data as { items: Review[]; total: number };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product: Product | null = null;
  let reviews: Review[] = [];
  let hasError = false;

  try {
    const [productData, reviewData] = await Promise.all([getProduct(params.id), getReviews(params.id)]);
    product = productData;
    reviews = reviewData.items;
  } catch {
    hasError = true;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {hasError ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-sm text-neutral-600">Unable to load product.</p>
            <Button variant="outline">Retry</Button>
          </div>
        ) : !product ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8">
            <Spinner />
            <p className="text-sm text-neutral-600">Loading product...</p>
          </div>
        ) : (
          <>
            <section className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <img
                  src={product.imageUrls?.[0] || '/images/placeholder.jpg'}
                  alt={product.name || 'Product image'}
                  className="h-80 w-full rounded-2xl object-cover"
                />
                <div className="grid grid-cols-3 gap-3">
                  {(product.imageUrls || []).slice(1, 4).map((url) => (
                    <img key={url} src={url} alt="Product thumbnail" className="h-24 w-full rounded-xl object-cover" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
                  <p className="text-lg font-semibold text-amber-700">${product.price?.toFixed(2)}</p>
                </div>
                <p className="text-sm text-neutral-600">{product.description}</p>
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-neutral-700" htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    defaultValue={1}
                    className="w-24 rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  />
                </div>
                <Button className="w-full">Add to cart</Button>
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-neutral-900">Customer reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-neutral-600">No reviews yet.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
