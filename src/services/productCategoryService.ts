import apiClient from '@/api/apiClient';
import type { ProductCategory } from '../types/product-category';

// Obtener todas las categorias de productos
export async function fetchProductCategories(): Promise<ProductCategory[]> {
  // Petición GET al endpoint de categorias de productos
  const response = await apiClient('/product-category');
  
  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener las categorías');
  }

  // si la respuesta es exitosa, retornar las categorías
  return data.categories;
}