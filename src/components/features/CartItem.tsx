import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartItemProps {
  item: CartLine;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  className?: string;
}

export function CartItem({ item, onQuantityChange, onRemove, className }: CartItemProps) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center', className)}>
      <img
        src={item.product.imageUrls?.[0] || '/images/placeholder.jpg'}
        alt={item.product.name || 'Cart item'}
        className="h-20 w-20 rounded-md object-cover"
      />
      <div className="flex-1">
        <h4 className="text-base font-semibold text-neutral-900">{item.product.name}</h4>
        <p className="text-sm text-neutral-600">${item.product.price?.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor={`qty-${item.product.id}`}>Quantity</label>
        <Input
          id={`qty-${item.product.id}`}
          type="number"
          min={1}
          value={item.quantity}
          onChange={(event) => onQuantityChange(item.product.id || '', Number(event.target.value))}
          className="w-20"
        />
        <Button variant="outline" onClick={() => onRemove(item.product.id || '')}>
          Remove
        </Button>
      </div>
    </div>
  );
}
