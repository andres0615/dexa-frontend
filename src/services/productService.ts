import type { Product, CreateProductPayload, UpdateProductPayload } from '../types/product';

// Obtener todos los productos
export async function fetchProducts(): Promise<Product[]> {
  // Petición GET al endpoint de productos
  const response = await fetch('/api/products');
  
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

// Crear un nuevo producto
export async function createProduct(
  payload: CreateProductPayload
): Promise<Product> {
  // Petición POST al endpoint de productos
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

// Obtener un producto por ID
export async function fetchProduct(id: number): Promise<any> {
  // Petición GET al endpoint de consulta de producto
  const response = await fetch(`/api/products/${id}`);
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
