import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLayoutContext } from '../../../contexts/LayoutContext';
import type { ThirdParty } from '../../../types/third-party';
import type { PaginationMeta } from '@/types/pagination';
import { fetchThirdPartiesPaginated, deleteThirdParty } from '../../../services/thirdPartyService';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { useToast } from '../../../components/toast/ToastContext';
import TablePagination from '@/components/ui/TablePagination';
import { fetchThirdPartyTypes } from '@/services/thirdPartyTypeService';
import type { ThirdPartyType } from '@/types/third-party-type';

export default function ThirdPartyListPage() {
  const { setMaxWidth } = useLayoutContext();
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [thirdPartyToDelete, setThirdPartyToDelete] = useState<ThirdParty | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const { showToast } = useToast();
  const [thirdPartyTypes, setThirdPartyTypes] = useState<ThirdPartyType[]>([]);

  // Click en el botón de eliminar
  function handleDeleteClick(thirdParty: ThirdParty): void {
    setThirdPartyToDelete(thirdParty);
    deleteDialogRef.current?.showModal();
  }

  // Cambiar de página en la paginación
  function handlePageChange(page: number): void {
    setCurrentPage(page);
  }

  // Resolver el nombre del tipo de tercero a partir de su id
  function getTypeName(thirdPartyTypeId: number): string {
    const type = thirdPartyTypes.find((t) => t.id === thirdPartyTypeId);
    return type?.name ?? '—';
  }

  useEffect(() => {
    setMaxWidth('max-w-[61rem]');
    return () => setMaxWidth('max-w-4xl');
  }, [setMaxWidth]);

  // Cargar terceros
  useEffect(() => {
    setLoading(true);
    fetchThirdPartiesPaginated(currentPage, 10)
      .then((result) => {
        setThirdParties(result.data);
        setPagination(result.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    fetchThirdPartyTypes()
      .then((types) => {
        setThirdPartyTypes(types);
      })
      .catch((err: Error) => {
        console.error('Error al cargar tipos de terceros:', err);
      });
  }, []);

  // Cuando el usuario confirma la eliminación
  async function handleConfirmDelete(): Promise<void> {
    // Si no hay un tercero para eliminar, salir
    if (!thirdPartyToDelete) return;
    try {
      await deleteThirdParty(thirdPartyToDelete.id);
      // Remover el tercero eliminado de la lista local sin recargar del backend
      setThirdParties((prev) => prev.filter((tp) => tp.id !== thirdPartyToDelete.id));
      showToast('Tercero eliminado exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showToast(err as string, 'error');
    } finally {
      // Cerrar el modal limpiando el tercero seleccionado
      setThirdPartyToDelete(null);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Terceros</h2>
        <Link to="/third-party/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Añadir Tercero
        </Link>
      </div>

      {/* Third Party Table */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="pl-11">Tercero</th>
                  <th>Tipo</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <span className="loading loading-ring loading-lg text-primary"></span>
                    </td>
                  </tr>
                ) : thirdParties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-base-content/60">
                      No hay terceros
                    </td>
                  </tr>
                ) : (
                  thirdParties.map((thirdParty) => (
                    <tr key={thirdParty.id} className="hover:bg-base-300">
                      <td className="pl-11">
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-placeholder">
                            <div className="bg-primary text-primary-content w-12 rounded-full">
                              <span>{thirdParty.name.charAt(0).toUpperCase()}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{thirdParty.name}</div>
                            {thirdParty.tax_id && (
                              <div className="text-sm opacity-50">NIT: {thirdParty.tax_id}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{getTypeName(thirdParty.third_party_type_id)}</td>
                      <td>
                        <div className="text-sm">
                          {thirdParty.email && <div>{thirdParty.email}</div>}
                          {thirdParty.phone && <div className="opacity-50">{thirdParty.phone}</div>}
                          {!thirdParty.email && !thirdParty.phone && <div className="opacity-50">—</div>}
                        </div>
                      </td>
                      <td>
                        {thirdParty.is_active === 1 ? (
                          <span className="badge badge-success badge-sm">Activo</span>
                        ) : (
                          <span className="badge badge-error badge-sm">Inactivo</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">

                          {/* Editar */}
                          <div className="tooltip" data-tip="Editar">
                            <Link to={`/third-party/${thirdParty.id}/edit`} className="btn btn-ghost btn-sm btn-square">
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
                              onClick={() => handleDeleteClick(thirdParty)}
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
        name={thirdPartyToDelete?.name ?? null}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
