import apiClient from '@/api/apiClient';
import type { Warehouse } from '../types/warehouse';

// Obtener todos los almacenes
export async function fetchWarehouses(): Promise<Warehouse[]> {
  // Petición GET al endpoint de almacenes
  const response = await apiClient('/warehouses');

  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener los almacenes');
  }

  // si la respuesta es exitosa, retornar los almacenes
  return data.warehouses;
}
