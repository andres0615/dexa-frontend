import type { Movement, CreateMovementPayload } from '../types/movements';
import type { PaginatedResult } from '@/types/pagination';

// Crear un nuevo movimiento de inventario
export async function createMovement(payload: CreateMovementPayload): Promise<Movement> {
  const response = await fetch('/api/movements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  });

  const { success, data, message } = await response.json();

  if (!success) {
    throw new Error(message ?? 'Error al crear el movimiento');
  }

  return data.movement;
}

// Obtener movimientos con paginación
export async function fetchMovementsPaginated(
  page: number = 1,
  perPage: number = 10,
  // filters?: ProductFilters
): Promise<PaginatedResult<Movement>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('per_page', String(perPage));

  // Agregar filtros si existen
  // if (filters) {
  //   for (const [key, value] of Object.entries(filters)) {
  //     if (value !== undefined && value !== null && value !== '') {
  //       params.append(key, String(value));
  //     }
  //   }
  // }

  const url = `/api/movements?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  const body = await response.json();
  const { success, data, message } = body;

  if (!success) {
    throw new Error(message ?? 'Error al obtener movimientos');
  }

  // Respuesta paginada: data.movements es un objeto con { data, current_page, ... }
  const movementsPaginated = data.movements;

  return {
    // Data es el array de movimientos
    data: movementsPaginated.data as Movement[],
    // Metadata de la paginacion
    pagination: {
      currentPage: movementsPaginated.current_page,
      lastPage: movementsPaginated.last_page,
      perPage: movementsPaginated.per_page,
      total: movementsPaginated.total,
      from: movementsPaginated.from,
      to: movementsPaginated.to,
    },
  };
}