import apiClient from '@/api/apiClient';
import type { MovementType } from '../types/movement-types';

// Obtener todos los tipos de movimiento
export async function fetchMovementTypes(): Promise<MovementType[]> {
  // Petición GET al endpoint de tipos de movimiento
  const response = await apiClient('/movement-type');

  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    throw new Error(message ?? 'Error al obtener los tipos de movimiento');
  }

  // si la respuesta es exitosa, retornar los tipos de movimiento
  return data.movement_types;
}
