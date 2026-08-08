import type { User, CreateUserPayload, UpdateUserPayload } from '../types/user';
import type { PaginatedResult } from '@/types/pagination';

// Obtener todos los usuarios
export async function fetchUsers(): Promise<User[]> {
  // Petición GET al endpoint de usuarios
  const response = await fetch('/api/users', {
    headers: { 'Accept': 'application/json' },
  });

  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    throw new Error(message ?? 'Error al obtener usuarios');
  }

  // si la respuesta es exitosa, retornar los usuarios
  return data.users;
}

// Obtener usuarios con paginación
export async function fetchUsersPaginated(
  page: number = 1,
  perPage: number = 10
): Promise<PaginatedResult<User>> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('per_page', String(perPage));

  const url = `/api/users?${params.toString()}`;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });

  const body = await response.json();
  const { success, data, message } = body;

  if (!success) {
    throw new Error(message ?? 'Error al obtener usuarios');
  }

  // Respuesta paginada: data.users es un objeto con { data, current_page, ... }
  const usersPaginated = data.users;

  return {
    // Data es el array de usuarios
    data: usersPaginated.data as User[],
    // Metadata de la paginacion
    pagination: {
      currentPage: usersPaginated.current_page,
      lastPage: usersPaginated.last_page,
      perPage: usersPaginated.per_page,
      total: usersPaginated.total,
      from: usersPaginated.from,
      to: usersPaginated.to,
    },
  };
}

// Crear un nuevo usuario
export async function createUser(
  payload: CreateUserPayload
): Promise<User> {
  // Petición POST al endpoint de usuarios
  const response = await fetch('/api/users', {
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
  if (!success) {
    let errorMessage = message ?? 'Error al crear el usuario'

    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }

    throw new Error(errorMessage);
  }
  // si la respuesta es exitosa, retornar el usuario
  return data.user;
}

// Eliminar un usuario
export async function deleteUser(id: number): Promise<void> {
  // Petición DELETE al endpoint de usuarios
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });

  // Extraer datos del wrapper
  const { success, message } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    throw new Error(message ?? 'Error al eliminar el usuario');
  }
}

// Obtener un usuario por ID
export async function fetchUser(id: number): Promise<User> {
  // Petición GET al endpoint de consulta de usuario
  const response = await fetch(`/api/users/${id}`, {
    headers: { 'Accept': 'application/json' },
  });
  // Extraer datos del wrapper
  const { success, data, message } = await response.json();

  // Verificar si la respuesta es exitosa
  if (!success) {
    throw new Error(message ?? 'Error al obtener el usuario');
  }
  // si la respuesta es exitosa, retornar el usuario
  return data.user;
}

// Actualizar un usuario existente
export async function updateUser(
  id: number,
  payload: UpdateUserPayload
): Promise<User> {
  // Petición PUT al endpoint de usuarios
  const response = await fetch(`/api/users/${id}`, {
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
  if (!success) {
    let errorMessage = message ?? 'Error al actualizar el usuario';

    // Si hay errores de validación, agregarlos al mensaje
    if (errors && errors.length > 0) {
      errorMessage += '\n' + errors.join('\n');
    }
    throw new Error(errorMessage);
  }

  // si la respuesta es exitosa, retornar el usuario
  return data.user;
}
