import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{review.rating} / 5</Badge>
          <span className="text-xs text-neutral-500">{new Date(review.createdAt || '').toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-neutral-700">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
