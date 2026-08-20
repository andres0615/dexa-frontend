import { useEffect, useRef, useState } from 'react';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { Link } from 'react-router-dom';
import { fetchMovementsPaginated, completeMovement, cancelMovement } from '@/services/movementService';
import { useToast } from '@/components/toast/ToastContext';
import ConfirmCompleteModal from '@/modules/movements/components/ConfirmCompleteModal';
import ConfirmCancelModal from '@/modules/movements/components/ConfirmCancelModal';
import type { Movement, MovementFilters } from '@/types/movements';
import type { PaginationMeta } from '@/types/pagination';
import { fetchMovementStatus } from '@/services/movementStatusService';
import type { MovementStatus } from '@/types/movement-status';
import MovementStatusBadge from '@/modules/movements/components/MovementStatusBadge';
import type { MovementType } from '@/types/movement-types';
import { fetchMovementTypes } from '@/services/movementTypeService';
import MovementTypeBadge from '@/modules/movements/components/MovementTypeBadge';
import TablePagination from '@/components/ui/TablePagination';
import { MOVEMENT_STATUSES } from '@/constants/global';
import { sleep, ucfirst } from '@/utils/utils';
import MovementStats from '@/modules/movements/components/MovementStats';

export default function MovementListPage() {
  // variables de estado
  const { setMaxWidth } = useLayoutContext();
  const [loadingMovements, setLoadingMovements] = useState(false)
  const [movements, setMovements] = useState<Movement[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [movementStatusList, setMovementStatusList] = useState<MovementStatus[]>([]);
  const [movementTypeList, setMovementTypeList] = useState<MovementType[]>([]);
  const [movementToComplete, setMovementToComplete] = useState<Movement | null>(null);
  const completeDialogRef = useRef<HTMLDialogElement>(null);
  const [movementToCancel, setMovementToCancel] = useState<Movement | null>(null);
  const cancelDialogRef = useRef<HTMLDialogElement>(null);
  const { showToast } = useToast();
  const [filters, setFilters] = useState<MovementFilters>({ voucher: '', movement_type_id: null, date_from: null, date_to: null });
  const [countFilters, setCountFilters] = useState(0)
  const loadingMovementsTimeout: number = 1000;

  // Seccion de handlers

  // Cambiar de página en la paginación
  function handlePageChange(page: number): void {
    setCurrentPage(page);
  }

  // Aplicar filtros al listado de movimientos
  function handleFilter(): void {
    setCurrentPage(1)
    setLoadingMovements(true)

    // Contar filtros activos
    const count = Object.values(filters).filter(value => value !== null && value !== '').length;
    setCountFilters(count);

    fetchMovementsPaginated(1, 10, filters)
      .then((result) => {
        setMovements(result.data);
        setPagination(result.pagination);
      })
      .then(() => sleep(loadingMovementsTimeout)) // espera 1s después del fetch
      .catch((err) => setError(err.message))
      .finally(() => setLoadingMovements(false));
  }

  // Click en el botón de completar
  function handleCompleteClick(movement: Movement): void {
    setMovementToComplete(movement);
    // mostrar el modal de confirmación
    completeDialogRef.current?.showModal();
  }

  // Click en el botón de cancelar
  function handleCancelClick(movement: Movement): void {
    setMovementToCancel(movement);
    // mostrar el modal de confirmación
    cancelDialogRef.current?.showModal();
  }

  // Cuando el usuario confirma la cancelación
  async function handleConfirmCancel(): Promise<void> {
    // Si no hay un movimiento para cancelar, salir
    if (!movementToCancel) return;
    try {
      const updated = await cancelMovement(movementToCancel.id);
      console.log('movimiento actualizado: ', updated);

      // Actualizar el movimiento en la lista local sin recargar del backend
      setMovements((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      showToast('Movimiento cancelado exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showToast(err as string, 'error');
    } finally {
      // Cerrar el modal limpiando el movimiento seleccionado
      setMovementToCancel(null);
    }
  }

  // Cuando el usuario confirma el completado
  async function handleConfirmComplete(): Promise<void> {
    // Si no hay un movimiento para completar, salir
    if (!movementToComplete) return;
    try {
      const updated = await completeMovement(movementToComplete.id);
      console.log('movimiento actualizado: ', updated);
      
      // Actualizar el movimiento en la lista local sin recargar del backend
      setMovements((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      showToast('Movimiento completado exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    } finally {
      // Cerrar el modal limpiando el movimiento seleccionado
      setMovementToComplete(null);
    }
  }

  // Seccion de useEffects

  useEffect(() => {
    setMaxWidth('max-w-[61rem]');
    return () => setMaxWidth('max-w-4xl');
  }, [setMaxWidth]);

  // Cargar movimientos
  useEffect(() => {
    setLoadingMovements(true)
    fetchMovementsPaginated(currentPage, 10, filters)
      .then((result) => {
        setMovements(result.data);
        setPagination(result.pagination);
        console.log('movimientos: ', result);
        // return result; // pasa al siguiente then
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingMovements(false));
  }, [currentPage]);

  // Cargar status de movimientos
  useEffect(() => {
    fetchMovementStatus()
      .then((result) => {
        setMovementStatusList(result);
        console.log('status de movimientos: ', result);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingMovements(false));
  }, []);

  // Cargar tipos de movimiento
  useEffect(() => {
    fetchMovementTypes()
      .then((result) => {
        setMovementTypeList(result);
        console.log('tipos de movimiento: ', result);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingMovements(false));
  }, []);

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Movimientos de Inventario</h2>
        <Link to="/movements/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nuevo Movimiento
        </Link>
      </div>

      {/* Stats */}
      <MovementStats />

      {/* Filters */}
      <div className="card bg-base-100 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="flex flex-col lg:flex-row gap-2 w-full items-end">
            <div className="grow w-full lg:w-auto">
              <label className="floating-label w-full">
                <span>Buscar movimiento</span>
                <label className="input input-md w-full">
                  <svg className="h-5 w-5 opacity-60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" placeholder="Comprobante" className="grow" value={filters.voucher ?? ''} onChange={(e) => setFilters(prev => ({ ...prev, voucher: e.target.value }))} />
                </label>
              </label>
            </div>
            <label className="floating-label w-full lg:w-auto min-w-[180px]">
              <span>Tipo de Movimiento</span>
              <select className="select select-md w-full"
                value={filters.movement_type_id ?? ''}
                onChange={(e) => setFilters(prev => ({ ...prev, movement_type_id: e.target.value ? Number(e.target.value) : null }))}>
                <option value="">Seleccionar</option>
                {movementTypeList.map((type) => (
                  <option key={type.id} value={type.id}>{ucfirst(type.name)}</option>
                ))}
              </select>
            </label>
            <label className="floating-label w-full lg:w-auto min-w-[150px]">
              <span>Fecha desde</span>
              <input type="date" className="input input-md w-full" value={filters.date_from ?? ''} onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))} />
            </label>
            <label className="floating-label w-full lg:w-auto min-w-[150px]">
              <span>Fecha hasta</span>
              <input type="date" className="input input-md w-full" value={filters.date_to ?? ''} onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))} />
            </label>
            <div className="indicator w-full lg:w-auto">
              {countFilters > 0 && (
                <span className="indicator-item badge badge-primary badge-sm">{countFilters}</span>
              )}
              <button className="btn btn-soft btn-md w-full" onClick={handleFilter}>Filtrar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="pl-12">Tipo</th>
                  <th>Fecha</th>
                  <th>Comprobante</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingMovements ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <span className="loading loading-ring loading-lg text-primary"></span>
                    </td>
                  </tr>
                ) : movements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-base-content/60">
                      No hay movimientos
                    </td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                  <tr className="hover:bg-base-300">
                    <td className="pl-12">
                      {/* Tipo de movimiento */}
                      <MovementTypeBadge movement={movement} types={movementTypeList} />
                    </td>
                    <td className="text-sm whitespace-nowrap">{ movement.movement_date }</td>
                    <td className="font-mono text-sm">{ movement.voucher }</td>
                    <td className="text-right text-sm font-medium">${ movement.total }</td>
                    <td className="text-center ">
                      {/* Status del movimiento */}
                      <MovementStatusBadge movement={movement} statuses={movementStatusList} />
                    </td>
                    <td className="px-1">
                      <div className="flex items-center gap-1">
                        {/* Editar */}
                        {movement.status_id === MOVEMENT_STATUSES.PENDIENTE && (
                          <div className="tooltip" data-tip="Editar">
                            <Link to={`/movements/${movement.id}/edit`} className="btn btn-ghost btn-sm btn-square">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                              </svg>
                            </Link>
                          </div>
                        )}
                        {/* Completar */}
                        {movement.status_id === MOVEMENT_STATUSES.PENDIENTE && (
                          <div className="tooltip" data-tip="Completar">
                            <button
                              onClick={() => handleCompleteClick(movement)}
                              className="btn btn-ghost btn-sm btn-square text-primary">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            </button>
                          </div>
                        )}
                        {/* Cancelar */}
                        {movement.status_id === MOVEMENT_STATUSES.PENDIENTE && (
                          <div className="tooltip" data-tip="Cancelar">
                            <button
                              onClick={() => handleCancelClick(movement)}
                              className="btn btn-ghost btn-sm btn-square text-error">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                        <div className="tooltip" data-tip="Ver">
                          <Link to={`/movements/${movement.id}/view`} className="btn btn-ghost btn-sm btn-square">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                              </svg>

                          </Link>
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

      <ConfirmCompleteModal
        dialogRef={completeDialogRef}
        name={movementToComplete?.voucher ?? null}
        onConfirm={handleConfirmComplete}
      />
      <ConfirmCancelModal
        dialogRef={cancelDialogRef}
        name={movementToCancel?.voucher ?? null}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}