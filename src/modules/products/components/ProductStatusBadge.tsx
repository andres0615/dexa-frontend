import type { Product } from '../../../types/product';
import type { ProductStatus } from '../../../types/product-status';
import { ucfirst } from '../../../utils/utils';

const badgeColorMap: Record<string, string> = {
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  neutral: 'badge-neutral',
};

export default function ProductStatusBadge({ product, statuses }: {
  product: Product;
  statuses: ProductStatus[];
}) {
  // Obtener el status del producto
  const status = statuses.find((status) => status.id === product.status_id);

  // obtener clase del badge según el color del status
  const badgeClass = badgeColorMap[status?.color ?? ''] ?? 'badge-ghost';

  return (
    <span className={`badge ${badgeClass} badge-sm`}>{ucfirst(status?.name || '')}</span>
  );
}