import type { Movement } from '@/types/movements';
import type { MovementStatus } from '@/types/movement-status';
import { ucfirst } from '@/utils/utils';

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

export default function MovementStatusBadge({ movement, statuses, size = 'sm' }: {
  movement: Movement;
  statuses: MovementStatus[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  // Obtener el status del movimiento
  const status = statuses.find((status) => status.id === movement.status_id);

  // obtener clase del badge según el color del status
  const badgeClass = badgeColorMap[status?.color ?? ''] ?? 'badge-ghost';

  return (
    <span className={`badge ${badgeClass} badge-${size}`}>{ucfirst(status?.name || '')}</span>
  );
}