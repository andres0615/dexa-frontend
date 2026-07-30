import type { Movement } from '@/types/movements';
import type { MovementType } from '@/types/movement-types';
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

export default function MovementTypeBadge({ movement, types }: {
  movement: Movement;
  types: MovementType[];
}) {
  // Obtener el tipo del movimiento
  const type = types.find((type) => type.id === movement.movement_type_id);

  // obtener clase del badge según el color del tipo
  const badgeClass = badgeColorMap[type?.color ?? ''] ?? 'badge-ghost';

  return (
    <span className={`badge ${badgeClass} badge-sm font-medium`}>{ucfirst(type?.name || '')}</span>
  );
}