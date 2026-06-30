import type { ProductStatus } from '../types/product-status';

// Obtener todos los status de productos
export async function fetchProductStatus(): Promise<ProductStatus[]> {
  // Petición GET al endpoint de status de productos
  const response = await fetch('/api/product-status', {
    headers: { 'Accept': 'application/json' },
  });
  
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