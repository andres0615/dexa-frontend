import apiClient from '@/api/apiClient';
import type { Movement, CreateMovementPayload, UpdateMovementPayload, MovementFilters } from '../types/movements';
import type { PaginatedResult } from '@/types/pagination';

// Crear un nuevo movimiento de inventario
export async function createMovement(payload: CreateMovementPayload): Promise<Movement> {
  const response = await apiClient('/movements', {
    method: 'POST',
    body: payload,
  });

  const { success, data, message, errors } = await response.json();

  if (!success) {

    let errorMessage = message ?? 'Error al crear el movimiento';

    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }

    throw new Error(errorMessage);
  }

  return data.movement;
}

// Obtener movimientos con paginación
export async function fetchMovementsPaginated(
  page: number = 1,
  perPage: number = 10,
  filters?: MovementFilters
): Promise<PaginatedResult<Movement>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('per_page', String(perPage));

  // Agregar filtros si existen
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    }
  }

  const url = `/movements?${params.toString()}`;

  const response = await apiClient(url);

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

// Obtener un movimiento por ID
export async function fetchMovement(id: number): Promise<any> {
  // Petición GET al endpoint de consulta de movimiento
  const response = await apiClient(`/movements/${id}`);
  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener el movimiento');
  }
  // si la respuesta es exitosa, retornar los productos
  return data.movement;
}

// Actualizar un producto existente
export async function updateMovement(
  id: number,
  payload: UpdateMovementPayload
): Promise<Movement> {
  // Petición PUT al endpoint de movimientos
  const response = await apiClient(`/movements/${id}`, {
    method: 'PUT',
    body: payload,
  });

  console.log('response: ', response);

  // Extraer datos del wrapper
  const { success, data, message, errors } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    let errorMessage = message ?? 'Error al actualizar el movimiento';
    
    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }
    throw new Error(errorMessage);
  }

  // si la respuesta es exitosa, retornar los productos
  return data.product;
}

// Completar un movimiento de inventario
export async function completeMovement(id: number): Promise<Movement> {
  const response = await apiClient(`/movements/${id}/complete`, {
    method: 'POST',
  });

  const { success, data, message } = await response.json();

  if (!success) {
    throw new Error(message ?? 'Error al completar el movimiento');
  }

  return data.movement;
}

// Cancelar un movimiento de inventario
export async function cancelMovement(id: number): Promise<Movement> {
  const response = await apiClient(`/movements/${id}/cancel`, {
    method: 'POST',
  });

  const { success, data, message } = await response.json();

  if (!success) {
    throw new Error(message ?? 'Error al cancelar el movimiento');
  }

  return data.movement;
}