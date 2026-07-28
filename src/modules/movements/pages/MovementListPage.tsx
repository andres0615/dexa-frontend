import { useEffect, useState } from 'react';
import { useLayoutContext } from '@/contexts/LayoutContext';
import { Link } from 'react-router-dom';
import { fetchMovementsPaginated } from '@/services/movementService';
import type { Movement } from '@/types/movements';
import type { PaginationMeta } from '@/types/pagination';

export default function MovementListPage() {
  // variables de estado
  const { setMaxWidth } = useLayoutContext();
  const [loadingMovements, setLoadingMovements] = useState(false)
  const [movements, setMovements] = useState<Movement[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Seccion de useEffects

  useEffect(() => {
    setMaxWidth('max-w-[61rem]');
    return () => setMaxWidth('max-w-4xl');
  }, [setMaxWidth]);

  // Cargar productos
    useEffect(() => {
      setLoadingMovements(true)
      fetchMovementsPaginated(currentPage, 10/*, filters*/)
        .then((result) => {
          setMovements(result.data);
          setPagination(result.pagination);
          console.log('movimientos: ', result);
          // return result; // pasa al siguiente then
        })
        // .then(() => sleep(loadingProductsTimeout)) // espera 1s después del fetch
        .catch((err) => setError(err.message))
        .finally(() => setLoadingMovements(false));
    }, [currentPage]);

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
      <div className="stats shadow bg-base-100 w-full mb-6 stats-vertical lg:stats-horizontal">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block h-8 w-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5 1.5H9.75m6 0h3m-3 0h-3m-3 0H6m3 0h3" />
            </svg>
          </div>
          <div className="stat-title">Total Movimientos</div>
          <div className="stat-value text-primary">248</div>
          <div className="stat-desc">12 más que el mes pasado</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block h-8 w-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <div className="stat-title">Entradas</div>
          <div className="stat-value text-success">142</div>
          <div className="stat-desc">57.3% del total</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block h-8 w-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <div className="stat-title">Salidas</div>
          <div className="stat-value text-error">89</div>
          <div className="stat-desc">35.9% del total</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block h-8 w-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="stat-title">Anulados</div>
          <div className="stat-value text-warning">17</div>
          <div className="stat-desc">6.9% necesita revisión</div>
        </div>
      </div>

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
                  <input type="text" placeholder="Comprobante" className="grow" />
                </label>
              </label>
            </div>
            <label className="floating-label w-full lg:w-auto min-w-[180px]">
              <span>Tipo de Movimiento</span>
              <select className="select select-md w-full">
                <option disabled selected>Seleccionar</option>
                <option>Compra</option>
                <option>Venta</option>
                <option>Ajuste</option>
                <option>Devolución</option>
                <option>Traslado</option>
              </select>
            </label>
            <label className="floating-label w-full lg:w-auto min-w-[150px]">
              <span>Fecha desde</span>
              <input type="date" className="input input-md w-full" />
            </label>
            <label className="floating-label w-full lg:w-auto min-w-[150px]">
              <span>Fecha hasta</span>
              <input type="date" className="input input-md w-full" />
            </label>
            <div className="indicator w-full lg:w-auto">
              <span className="indicator-item badge badge-primary badge-sm">3</span>
              <button className="btn btn-soft btn-md w-full">Filtrar</button>
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
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Comprobante</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* Compra 1 */}
                <tr>
                  <th>
                    <label><input type="checkbox" className="checkbox" /></label>
                  </th>
                  <td>
                    <span className="badge badge-success badge-sm font-medium">Compra</span>
                  </td>
                  <td className="text-sm whitespace-nowrap">01/07/2026</td>
                  <td className="font-mono text-sm">FC-001-2026</td>
                  <td className="text-right text-sm font-medium">$1,234.50</td>
                  <td className="text-center">
                    <span className="badge badge-success badge-xs">Completado</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {/* Editar */}
                      <div className="tooltip" data-tip="Editar">
                        <button className="btn btn-ghost btn-sm btn-square">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                      </div>
                      {/* Eliminar */}
                      <div className="tooltip" data-tip="Eliminar">
                        <button className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Compra 2 */}
                <tr>
                  <th>
                    <label><input type="checkbox" className="checkbox" /></label>
                  </th>
                  <td>
                    <span className="badge badge-success badge-sm font-medium">Compra</span>
                  </td>
                  <td className="text-sm whitespace-nowrap">03/07/2026</td>
                  <td className="font-mono text-sm">FC-002-2026</td>
                  <td className="text-right text-sm font-medium">$567.80</td>
                  <td className="text-center">
                    <span className="badge badge-success badge-xs">Completado</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="tooltip" data-tip="Editar">
                        <button className="btn btn-ghost btn-sm btn-square">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Eliminar">
                        <button className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Venta 1 */}
                <tr>
                  <th>
                    <label><input type="checkbox" className="checkbox" /></label>
                  </th>
                  <td>
                    <span className="badge badge-error badge-sm font-medium">Venta</span>
                  </td>
                  <td className="text-sm whitespace-nowrap">05/07/2026</td>
                  <td className="font-mono text-sm">FV-001-2026</td>
                  <td className="text-right text-sm font-medium">$899.99</td>
                  <td className="text-center">
                    <span className="badge badge-success badge-xs">Completado</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="tooltip" data-tip="Editar">
                        <button className="btn btn-ghost btn-sm btn-square">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Eliminar">
                        <button className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Venta 2 */}
                <tr>
                  <th>
                    <label><input type="checkbox" className="checkbox" /></label>
                  </th>
                  <td>
                    <span className="badge badge-error badge-sm font-medium">Venta</span>
                  </td>
                  <td className="text-sm whitespace-nowrap">06/07/2026</td>
                  <td className="font-mono text-sm">FV-002-2026</td>
                  <td className="text-right text-sm font-medium">$156.50</td>
                  <td className="text-center">
                    <span className="badge badge-success badge-xs">Completado</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="tooltip" data-tip="Editar">
                        <button className="btn btn-ghost btn-sm btn-square">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                      </div>
                      <div className="tooltip" data-tip="Eliminar">
                        <button className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-base-content/60 ml-2">Mostrando 1-10 de 248 movimientos</p>
        <div className="join">
          <button className="join-item btn btn-soft btn-sm">«</button>
          <button className="join-item btn btn-soft btn-sm btn-active">1</button>
          <button className="join-item btn btn-soft btn-sm">2</button>
          <button className="join-item btn btn-soft btn-sm">3</button>
          <button className="join-item btn btn-soft btn-sm">4</button>
          <button className="join-item btn btn-soft btn-sm">5</button>
          <button className="join-item btn btn-soft btn-sm">»</button>
        </div>
      </div>
    </>
  );
}