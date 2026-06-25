import type { Product, CreateProductPayload } from '../types/product';

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status}`);
  }
  return response.json();
}

export async function createProduct(
  data: CreateProductPayload
): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error al crear producto: ${response.status}`);
  }
  return response.json();
}
