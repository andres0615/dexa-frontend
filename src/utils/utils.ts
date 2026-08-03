export function ucfirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Convierte una fecha al formato requerido por <input type="date"> (yyyy-MM-dd)
export function formatDateToInput(value: string | null | undefined): string {
  if (!value) return '';

  // Si ya viene en formato yyyy-MM-dd, se devuelve tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  // Si viene en formato dd/MM/yyyy, se convierte
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, day, month, year] = match;
    return `${year}-${month}-${day}`;
  }

  // Cualquier otro formato se devuelve sin cambios
  return value;
}
