import type { Movement, CreateMovementPayload } from '../types/movements';

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
