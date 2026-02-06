import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  onView?: (orderId: string) => void;
}

export function OrderCard({ order, onView }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">Order #{order.id}</h3>
          <p className="text-sm text-neutral-600">{new Date(order.createdAt || '').toLocaleDateString()}</p>
        </div>
        <Badge variant="secondary" className="capitalize">{order.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-neutral-600">Items: {order.items?.length || 0}</p>
        <p className="text-base font-semibold text-amber-700">Total: ${order.totalAmount?.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => onView?.(order.id || '')}>
          View details
        </Button>
      </CardFooter>
    </Card>
  );
}
