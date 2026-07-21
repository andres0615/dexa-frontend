import type { Product, CreateProductPayload, UpdateProductPayload, ProductFilters } from '../types/product';
import type { PaginatedResult } from '@/types/pagination';

// Obtener todos los productos
export async function fetchProducts(): Promise<Product[]> {
  // Petición GET al endpoint de productos
  const response = await fetch('/api/products', {
    headers: { 'Accept': 'application/json' },
  });
  
  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener productos');
  }

  // si la respuesta es exitosa, retornar los productos
  return data.products;
}

// Obtener productos con paginación
export async function fetchProductsPaginated(
  page: number = 1,
  perPage: number = 10,
  filters?: ProductFilters
): Promise<PaginatedResult<Product>> {
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

  const url = `/api/products?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  const body = await response.json();
  const { success, data, message } = body;

  if (!success) {
    throw new Error(message ?? 'Error al obtener productos');
  }

  // Respuesta paginada: data.products es un objeto con { data, current_page, ... }
  const productsPaginated = data.products;

  return {
    // Data es el array de productos
    data: productsPaginated.data as Product[],
    // Metadata de la paginacion
    pagination: {
      currentPage: productsPaginated.current_page,
      lastPage: productsPaginated.last_page,
      perPage: productsPaginated.per_page,
      total: productsPaginated.total,
      from: productsPaginated.from,
      to: productsPaginated.to,
    },
  };
}

// Crear un nuevo producto
export async function createProduct(
  payload: CreateProductPayload
): Promise<Product> {
  // Petición POST al endpoint de productos
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // Extraer datos del wrapper
  const { success, data, message, errors } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    let errorMessage = message ?? 'Error al crear el producto'

    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }

    throw new Error(errorMessage);
  }
  // si la respuesta es exitosa, retornar los productos
  return data.product;
}

// Eliminar un producto
export async function deleteProduct(id: number): Promise<void> {
  // Petición DELETE al endpoint de productos
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });

  // Extraer datos del wrapper
  const { success, message } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    throw new Error(message ?? 'Error al eliminar el producto');
  }
}

// Obtener un producto por ID
export async function fetchProduct(id: number): Promise<any> {
  // Petición GET al endpoint de consulta de producto
  const response = await fetch(`/api/products/${id}`, {
    headers: { 'Accept': 'application/json' },
  });
  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener el producto');
  }
  // si la respuesta es exitosa, retornar los productos
  return data.product;
}

// Actualizar un producto existente
export async function updateProduct(
  id: number,
  payload: UpdateProductPayload
): Promise<Product> {
  // Petición PUT al endpoint de productos
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  console.log('response: ', response);

  // Extraer datos del wrapper
  const { success, data, message, errors } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    let errorMessage = message ?? 'Error al actualizar el producto';
    
    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }
    throw new Error(errorMessage);
  }

  // si la respuesta es exitosa, retornar los productos
  return data.product;
}
