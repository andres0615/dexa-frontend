import apiClient from '@/api/apiClient';
import type {
  ThirdParty,
  ThirdPartyFilters,
  CreateThirdPartyPayload,
  UpdateThirdPartyPayload,
} from '../types/third-party';
import type { PaginatedResult } from '@/types/pagination';

// Obtener todos los terceros (proveedores/clientes)
export async function fetchThirdParties(
  filters?: ThirdPartyFilters
): Promise<ThirdParty[]> {

  const params = new URLSearchParams();
  
  // Agregar filtros si existen
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    }
  }

  const url = `/third-party?${params.toString()}`;

  // Petición GET al endpoint de terceros
  const response = await apiClient(url);

  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener los terceros');
  }

  // si la respuesta es exitosa, retornar los terceros
  return data.third_parties;
}

// Obtener terceros con paginación
export async function fetchThirdPartiesPaginated(
  page: number = 1,
  perPage: number = 10,
  filters?: ThirdPartyFilters
): Promise<PaginatedResult<ThirdParty>> {
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

  const url = `/third-party?${params.toString()}`;

  const response = await apiClient(url);

  const body = await response.json();
  const { success, data, message } = body;

  if (!success) {
    throw new Error(message ?? 'Error al obtener los terceros');
  }

  // Respuesta paginada: data.third_parties es un objeto con { data, current_page, ... }
  const thirdPartiesPaginated = data.third_parties;

  return {
    // Data es el array de terceros
    data: thirdPartiesPaginated.data as ThirdParty[],
    // Metadata de la paginacion
    pagination: {
      currentPage: thirdPartiesPaginated.current_page,
      lastPage: thirdPartiesPaginated.last_page,
      perPage: thirdPartiesPaginated.per_page,
      total: thirdPartiesPaginated.total,
      from: thirdPartiesPaginated.from,
      to: thirdPartiesPaginated.to,
    },
  };
}

// Crear un nuevo tercero
export async function createThirdParty(
  payload: CreateThirdPartyPayload
): Promise<ThirdParty> {
  // Petición POST al endpoint de terceros
  const response = await apiClient('/third-party', {
    method: 'POST',
    body: payload,
  });

  // Extraer datos del wrapper
  const { success, data, message, errors } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    let errorMessage = message ?? 'Error al crear el tercero'

    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }

    throw new Error(errorMessage);
  }
  // si la respuesta es exitosa, retornar los terceros
  return data.third_party;
}

// Eliminar un tercero
export async function deleteThirdParty(id: number): Promise<void> {
  // Petición DELETE al endpoint de terceros
  const response = await apiClient(`/third-party/${id}`, {
    method: 'DELETE',
  });

  // Extraer datos del wrapper
  const { success, message } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    throw new Error(message ?? 'Error al eliminar el tercero');
  }
}

// Obtener un tercero por ID
export async function fetchThirdParty(id: number): Promise<ThirdParty> {
  // Petición GET al endpoint de consulta de tercero
  const response = await apiClient(`/third-party/${id}`);
  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener el tercero');
  }
  // si la respuesta es exitosa, retornar el tercero
  return data.third_party;
}

// Actualizar un tercero existente
export async function updateThirdParty(
  id: number,
  payload: UpdateThirdPartyPayload
): Promise<ThirdParty> {
  // Petición PUT al endpoint de terceros
  const response = await apiClient(`/third-party/${id}`, {
    method: 'PUT',
    body: payload,
  });

  // Extraer datos del wrapper
  const { success, data, message, errors } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    let errorMessage = message ?? 'Error al actualizar el tercero';

    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }
    throw new Error(errorMessage);
  }

  // si la respuesta es exitosa, retornar el tercero
  return data.third_party;
}
