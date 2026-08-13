import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLayoutContext } from '../../../contexts/LayoutContext';
import type { User } from '../../../types/user';
import type { PaginationMeta } from '@/types/pagination';
import { fetchUsersPaginated, deleteUser } from '../../../services/userService';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { useToast } from '../../../components/toast/ToastContext';
import TablePagination from '@/components/ui/TablePagination';

export default function UserListPage() {
  const { setMaxWidth } = useLayoutContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const { showToast } = useToast();

  // Click en el botón de eliminar
  function handleDeleteClick(user: User): void {
    setUserToDelete(user);
    deleteDialogRef.current?.showModal();
  }

  // Cambiar de página en la paginación
  function handlePageChange(page: number): void {
    setCurrentPage(page);
  }

  useEffect(() => {
    setMaxWidth('max-w-[61rem]');
    return () => setMaxWidth('max-w-4xl');
  }, [setMaxWidth]);

  // Cargar usuarios
  useEffect(() => {
    setLoading(true);
    fetchUsersPaginated(currentPage, 10)
      .then((result) => {
        setUsers(result.data);
        setPagination(result.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentPage]);

  // Cuando el usuario confirma la eliminacion
  async function handleConfirmDelete(): Promise<void> {
    // Si no hay un usuario para eliminar, salir
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      // Remover el usuario eliminado de la lista local sin recargar del backend
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      showToast('Usuario eliminado exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showToast(err as string, 'error');
    } finally {
      // Cerrar el modal limpiando el usuario seleccionado
      setUserToDelete(null);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <Link to="/users/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Añadir Usuario
        </Link>
      </div>

      {/* User Table */}
      <div className="card bg-base-100 shadow-md mb-6 pl-6">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Registro</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8">
                      <span className="loading loading-ring loading-lg text-primary"></span>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-base-content/60">
                      No hay usuarios
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="font-bold">{user.name}</div>
                      </td>
                      <td>{user.email}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="flex items-center gap-1">

                          {/* Editar */}
                          <div className="tooltip" data-tip="Editar">
                            <Link to={`/users/${user.id}/edit`} className="btn btn-ghost btn-sm btn-square">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </Link>
                          </div>

                          {/* Eliminar */}
                          <div className="tooltip" data-tip="Eliminar">
                            <button
                              className="btn btn-ghost btn-sm btn-square text-error"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                            </button>
                          </div>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      <TablePagination
        currentPage={currentPage}
        lastPage={pagination?.lastPage ?? 1}
        total={pagination?.total ?? 0}
        from={pagination?.from ?? null}
        to={pagination?.to ?? null}
        onPageChange={handlePageChange}
      />

      <ConfirmDeleteModal
        dialogRef={deleteDialogRef}
        name={userToDelete?.name ?? null}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
