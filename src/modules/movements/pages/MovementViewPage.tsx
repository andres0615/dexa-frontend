import { fetchMovement } from '@/services/movementService';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Movement } from '@/types/movements';
import { MOVEMENT_TYPE_IDS } from '@/constants/global';
import { ucfirst } from '@/utils/utils';
import MovementStatusBadge from '@/modules/movements/components/MovementStatusBadge';
import { fetchMovementStatus } from '@/services/movementStatusService';

const badgeColorMap: Record<string, string> = {
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  neutral: 'badge-neutral',
};

// Item de solo lectura: etiqueta + valor
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm font-medium block">{label}</span>
      <span className="text-base text-base-content/60 text-sm block">{value}</span>
    </div>
  );
}

// Formato de moneda, sigue el patrón del proyecto
function formatMoney(value: number | string | null | undefined): string {
  const num = Number(value) || 0;
  return `$${num.toFixed(2)}`;
}

// Convierte un booleano a texto legible
function formatBoolean(value: boolean): string {
  return value ? 'Sí' : 'No';
}

export default function MovementViewPage() {

  const { id } = useParams<{ id: string }>();

  const [movement, setMovement] = useState<Movement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movementStatuses, setMovementStatuses] = useState<MovementStatus[]>([]);

  useEffect(() => {
    // Validar que el ID esté presente en la URL
    if (!id) return;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setError('ID de movimiento inválido');
      return;
    }

    // Iniciar la carga
    setLoading(true);
    setError(null);

    // Obtener el movimiento desde la API
    fetchMovement(numericId)
      .then((movement) => {
        console.log('movimiento obtenido: ', movement);        
        setMovement(movement);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Cargar los status de movimiento
  useEffect(() => {
      fetchMovementStatus()
          .then((result) => {
              console.log('movement statuses: ', result);
              setMovementStatuses(result);
          })
          .catch((err) => console.error(err))
          .finally(() => { });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-error">{error}</p>
        <Link to="/movements" className="btn btn-soft">Volver a Movimientos</Link>
      </div>
    );
  }

  if (!movement) {
    return null;
  }

  const isAdjustment = movement.movement_type_id === MOVEMENT_TYPE_IDS.AJUSTE;
  const isReturn = movement.movement_type_id === MOVEMENT_TYPE_IDS.DEVOLUCION;
  const isSale = movement.movement_type_id === MOVEMENT_TYPE_IDS.VENTA;
  const showThirdParty = !isAdjustment && movement.movement_type_id !== MOVEMENT_TYPE_IDS.TRASLADO;
  const thirdPartyTitle = isSale ? 'Cliente' : 'Proveedor';
  const unitCostHeader = isSale ? 'Precio Unitario' : 'Costo Unitario';
  const typeBadgeClass = badgeColorMap[movement.movement_type.color] ?? 'badge-ghost';

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/movements">Movimientos de Inventario</Link></li>
          <li className="text-base-content/70">Detalle</li>
        </ul>
      </nav>

      {/* Encabezado */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold">Movimiento de Inventario</h2>
        <span className={`badge ${typeBadgeClass} badge-sm`}>{ucfirst(movement.movement_type.name)}</span>
        <MovementStatusBadge movement={movement} statuses={movementStatuses} size="sm" />
      </div>

      {/* Información General */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="Tipo" value={ucfirst(movement.movement_type.name)} />
            {isAdjustment && (
              <DetailItem label="Tipo de Ajuste" value={movement.adjustment_is_entry ? 'Entrada' : 'Salida'} />
            )}
            <DetailItem label="Fecha del Movimiento" value={movement.movement_date || '—'} />
            <DetailItem label="N° Comprobante / Factura" value={movement.voucher || '—'} />
            {isReturn && (
              <DetailItem label="Comprobante Original" value={movement.original_voucher || '—'} />
            )}
            <DetailItem label="Estado" value={movement.status.name} />
            <div className="md:col-span-2">
              <DetailItem label="Nota / Concepto" value={movement.note || '—'} />
            </div>
          </div>
        </div>
      </div>

      {/* Tercero */}
      {showThirdParty && (
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">{thirdPartyTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailItem label="Nombre" value={movement.third_party?.name || '—'} />
              <DetailItem label="N° Documento" value={movement.third_party_document || '—'} />
              <DetailItem label="Teléfono" value={movement.third_party_phone || '—'} />
            </div>
          </div>
        </div>
      )}

      {/* Detalle de Productos */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Detalle de Productos</h3>
          {!movement.details || movement.details.length === 0 ? (
            <p className="text-base-content/60 text-sm">Sin productos en el detalle</p>
          ) : (
            <div>
              <table className="table w-full overflow-x-auto">
                <thead>
                  <tr>
                    <th className="w-2/5">Producto</th>
                    <th className="w-1/6">Cantidad</th>
                    <th className="w-1/6">{unitCostHeader}</th>
                    <th className="w-1/6">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {movement.details.map((detail) => (
                    <tr key={detail.id}>
                      <td>
                        <span className="font-medium">{detail.product?.name ?? '—'}</span>
                        {detail.product?.code && (
                          <span className="text-xs text-base-content/60 block">{detail.product.code}</span>
                        )}
                      </td>
                      <td>{detail.quantity}</td>
                      <td>{formatMoney(detail.unit_cost)}</td>
                      <td>{formatMoney(detail.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm font-medium">Total del Movimiento</span>
                <span className="text-xl font-bold">{formatMoney(movement.total)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuración */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Configuración</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="Permitir salida sin stock" value={formatBoolean(movement.allow_out_of_stock)} />
            <div className="md:col-span-2">
              <DetailItem label="Observaciones" value={movement.observations || '—'} />
            </div>
          </div>
        </div>
      </div>

      {/* Auditoría */}
      {/* <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">Auditoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DetailItem label="Creado por" value={movement.created_by ? String(movement.created_by) : '—'} />
            <DetailItem label="Fecha de creación" value={movement.created_at || '—'} />
            <DetailItem label="Fecha de actualización" value={movement.updated_at || '—'} />
          </div>
        </div>
      </div> */}

      {/* Acciones */}
      <div className="flex flex-wrap gap-3">
        <Link to="/movements" className="btn btn-soft">Volver a Movimientos</Link>
      </div>
    </>
  );
}
