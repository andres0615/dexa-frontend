import apiClient from "@/api/apiClient";
import type { ThirdPartyType } from "@/types/third-party-type";

// Obtener todos los tipos de terceros
export async function fetchThirdPartyTypes(): Promise<ThirdPartyType[]> {
  // Petición GET al endpoint de tipos de terceros
  const response = await apiClient('/third-party-type');
  
  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  // desde el back los errores se capturan con try-catch y se convierten en HTTP 500/422 con success: false
  if (!success) {
    throw new Error(message ?? 'Error al obtener tipos de terceros');
  }

  // si la respuesta es exitosa, retornar los tipos de terceros
  return data.third_party_types;
}