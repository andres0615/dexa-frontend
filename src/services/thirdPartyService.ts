import type { ThirdParty, ThirdPartyFilters } from '../types/third-party';

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

  const url = `/api/third-party?${params.toString()}`;

  // Petición GET al endpoint de terceros
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

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
