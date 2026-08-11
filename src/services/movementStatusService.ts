import apiClient from '@/api/apiClient';
import type { MovementStatus } from '@/types/movement-status';

// Obtener todos los status de movimientos
export async function fetchMovementStatus(): Promise<MovementStatus[]> {
  // Petición GET al endpoint de status de movimientos
  const response = await apiClient('/movement-status');
  
  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener los status');
  }

  // si la respuesta es exitosa, retornar los productos
  return data.statuses;
}