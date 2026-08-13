import apiClient from '@/api/apiClient';
import type {
  ProductCategory,
  CreateProductCategoryPayload,
  UpdateProductCategoryPayload,
} from '../types/product-category';
import type { PaginatedResult } from '@/types/pagination';

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

// Obtener categorias de productos con paginación
export async function fetchProductCategoriesPaginated(
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedResult<ProductCategory>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('per_page', String(perPage));

  const url = `/product-category?${params.toString()}`;

  const response = await apiClient(url);

  const body = await response.json();
  const { success, data, message } = body;

  if (!success) {
    throw new Error(message ?? 'Error al obtener las categorías');
  }

  // Respuesta paginada: data.categories es un objeto con { data, current_page, ... }
  const categoriesPaginated = data.categories;

  return {
    // Data es el array de categorias
    data: categoriesPaginated.data as ProductCategory[],
    // Metadata de la paginacion
    pagination: {
      currentPage: categoriesPaginated.current_page,
      lastPage: categoriesPaginated.last_page,
      perPage: categoriesPaginated.per_page,
      total: categoriesPaginated.total,
      from: categoriesPaginated.from,
      to: categoriesPaginated.to,
    },
  };
}

// Obtener una categoria de producto por ID
export async function fetchProductCategory(id: number): Promise<ProductCategory> {
  // Petición GET al endpoint de consulta de categoria
  const response = await apiClient(`/product-category/${id}`);

  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    throw new Error(message ?? 'Error al obtener la categoría');
  }

  // si la respuesta es exitosa, retornar la categoría
  return data.category;
}

// Crear una nueva categoria de producto
export async function createProductCategory(
  payload: CreateProductCategoryPayload
): Promise<ProductCategory> {
  // Petición POST al endpoint de categorias de productos
  const response = await apiClient('/product-category', {
    method: 'POST',
    body: payload,
  });

  // Extraer datos del wrapper
  const { success, data, message, errors } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    let errorMessage = message ?? 'Error al crear la categoría';

    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }

    throw new Error(errorMessage);
  }

  // si la respuesta es exitosa, retornar la categoría
  return data.category;
}

// Actualizar una categoria de producto existente
export async function updateProductCategory(
  id: number,
  payload: UpdateProductCategoryPayload
): Promise<ProductCategory> {
  // Petición PUT al endpoint de categorias de productos
  const response = await apiClient(`/product-category/${id}`, {
    method: 'PUT',
    body: payload,
  });

  // Extraer datos del wrapper
  const { success, data, message, errors } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    let errorMessage = message ?? 'Error al actualizar la categoría';

    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }

    throw new Error(errorMessage);
  }

  // si la respuesta es exitosa, retornar la categoría
  return data.category;
}

// Eliminar una categoria de producto
export async function deleteProductCategory(id: number): Promise<void> {
  // Petición DELETE al endpoint de categorias de productos
  const response = await apiClient(`/product-category/${id}`, {
    method: 'DELETE',
  });

  // Extraer datos del wrapper
  const { success, message } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    throw new Error(message ?? 'Error al eliminar la categoría');
  }
}