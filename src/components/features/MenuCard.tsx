import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface MenuCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  className?: string;
}

export function MenuCard({ product, onAddToCart, className }: MenuCardProps) {
  return (
    <Card className={cn('flex h-full flex-col overflow-hidden', className)}>
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <img
            src={product.imageUrls?.[0] || '/images/placeholder.jpg'}
            alt={product.name || 'Menu item'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {product.featured && (
            <Badge className="absolute left-3 top-3">Featured</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-neutral-900">{product.name}</h3>
          <span className="text-base font-semibold text-amber-700">${product.price?.toFixed(2)}</span>
        </div>
        <p className="line-clamp-2 text-sm text-neutral-600">{product.description}</p>
        <div className="flex flex-wrap gap-2">
          {product.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={() => onAddToCart?.(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
