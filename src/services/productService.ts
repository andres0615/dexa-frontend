import type { Product } from '../types/product';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status}`);
  }
  return response.json();
}
