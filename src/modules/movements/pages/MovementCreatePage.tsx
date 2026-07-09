import { useState, useEffect } from 'react';
import type { MovementType } from '@/types/movement-types';
import { fetchMovementTypes } from '@/services/movementTypeService';
import { MOVEMENT_TYPE_IDS } from '@/constants/global';

interface ItemRow {
  id: string;
  product_id: string;
  quantity: number;
  unit_cost: number;
}

const PRODUCT_OPTIONS = [
  'PROD-001 — Laptop HP',
  'PROD-002 — Mouse Inalámbrico',
  'PROD-003 — Teclado Mecánico',
  'PROD-004 — Monitor 27"',
  'PROD-005 — Webcam HD',
];

let nextRowId = 1;
function generateId() {
  return `fila_${nextRowId++}`;
}

export default function MovementCreatePage() {
  const [movementType, setMovementType] = useState<number | null>(null);
  const [adjustmentIsEntry, setAdjustmentIsEntry] = useState(true);
  const [allowOutOfStock, setAllowOutOfStock] = useState(false);
  const [generateReverse, setGenerateReverse] = useState(true);
  const [valuationMethod, setValuationMethod] = useState('promedio');
  const [items, setItems] = useState<ItemRow[]>([
    { id: generateId(), product_id: '', quantity: 0, unit_cost: 0 },
  ]);

  // Mostrar u ocultar campos según el tipo de movimiento
  const showAdjustmentToggle = movementType === MOVEMENT_TYPE_IDS.AJUSTE;
  const showSourceWarehouse = movementType === MOVEMENT_TYPE_IDS.AJUSTE || movementType === MOVEMENT_TYPE_IDS.TRASLADO;
  const showDestinationWarehouse = movementType === MOVEMENT_TYPE_IDS.TRASLADO;
  const showOriginalVoucher = movementType === MOVEMENT_TYPE_IDS.DEVOLUCION;
  const showThirdParty = movementType !== MOVEMENT_TYPE_IDS.AJUSTE && movementType !== MOVEMENT_TYPE_IDS.TRASLADO && movementType !== null;

  // Cambio de textos según el tipo de movimiento
  const thirdPartyTitle = movementType === MOVEMENT_TYPE_IDS.VENTA ? 'Cliente' : 'Proveedor';
  const unitCostHeader = movementType === MOVEMENT_TYPE_IDS.VENTA ? 'Precio Unitario' : 'Costo Unitario';

  const [movementTypes, setMovementTypes] = useState<MovementType[]>([]);

  const total = items.reduce((acc, p) => acc + p.quantity * p.unit_cost, 0);

  function handleItemChange(id: string, field: 'product_id' | 'quantity' | 'unit_cost', value: string | number) {
    setItems(prev => prev.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  }

  function handleAddRow() {
    setItems(prev => [...prev, { id: generateId(), product_id: '', quantity: 0, unit_cost: 0 }]);
  }

  function handleRemoveRow(id: string) {
    setItems(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(p => p.id !== id);
    });
  }

  // Cargar los tipos de movimiento
  useEffect(() => {
    fetchMovementTypes()
      .then((result) => {
        console.log('movement types: ', result);        
        setMovementTypes(result);
      })
      .catch((err) => console.error(err))
      .finally(() => { });
  }, []);

  // Select para tipos de movimientos
  const movementTypesSelect = (
    <label className="floating-label">
      <select
        name="movement_type"
        id="movement_type"
        className="select select-md w-full"
        value={movementType}
        onChange={e => setMovementType(e.target.value ? Number(e.target.value) : null)}
        required
      >
        <option value="">Seleccionar</option>
        {movementTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      <span>Tipo de Movimiento</span>
    </label>
  );

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
        <ul>
          <li><span>Movimientos de Inventario</span></li>
          <li><span className="text-base-content/70">Crear</span></li>
        </ul>
      </nav>

      <h2 className="text-2xl font-bold mb-8">Registrar Movimiento de Inventario</h2>
      <form>
        {/* Tipo de Movimiento */}
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Tipo de Movimiento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              { movementTypesSelect }

              {showAdjustmentToggle && (
                <div id="adjustment_type">
                  <span className="font-medium text-sm block">Tipo de Ajuste</span>
                  <div className="flex items-center gap-3 h-10">
                    <input
                      name="adjustment_type"
                      id="adjustment_type_input"
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={adjustmentIsEntry}
                      onChange={e => setAdjustmentIsEntry(e.target.checked)}
                    />
                    <span className="text-sm font-light">{adjustmentIsEntry ? 'Entrada' : 'Salida'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información General */}
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="floating-label">
                <span>Fecha del Movimiento</span>
                <input name="movement_date" id="movement_date" type="date" className="input input-md w-full" required />
              </label>
              <label className="floating-label">
                <span>N° Comprobante / Factura</span>
                <input name="voucher" id="voucher" type="text" placeholder="N° Comprobante / Factura" className="input input-md w-full" />
              </label>
              <label className="floating-label">
                <select name="warehouse_id" id="warehouse_id" className="select select-md w-full" required defaultValue="">
                  <option value="" disabled>Seleccionar</option>
                  <option>Almacén Principal</option>
                  <option>Almacén Secundario</option>
                  <option>Taller</option>
                </select>
                <span>Almacén</span>
              </label>

              {showSourceWarehouse && (
                <div id="source_warehouse_id">
                  <label className="floating-label">
                    <select name="source_warehouse_id" id="source_warehouse_id" className="select select-md w-full" required defaultValue="">
                      <option value="" disabled>Seleccionar</option>
                      <option>Almacén Principal</option>
                      <option>Almacén Secundario</option>
                      <option>Taller</option>
                    </select>
                    <span>Almacén Origen</span>
                  </label>
                </div>
              )}

              {showDestinationWarehouse && (
                <div id="destination_warehouse_id">
                  <label className="floating-label">
                    <select name="destination_warehouse_id" id="destination_warehouse_id" className="select select-md w-full" required defaultValue="">
                      <option value="" disabled>Seleccionar</option>
                      <option>Almacén Principal</option>
                      <option>Almacén Secundario</option>
                      <option>Taller</option>
                    </select>
                    <span>Almacén Destino</span>
                  </label>
                </div>
              )}

              {showOriginalVoucher && (
                <div id="original_voucher_wrapper" className="md:col-span-3">
                  <label className="floating-label">
                    <span>Comprobante Original</span>
                    <input name="original_voucher" id="original_voucher" type="text" placeholder="N° de comprobante que origina la devolución" className="input input-md w-full" />
                  </label>
                </div>
              )}

              <div className="md:col-span-3">
                <label className="floating-label">
                  <span>Nota / Concepto</span>
                  <textarea name="note" id="note" className="textarea textarea-md w-full h-24" placeholder="Nota o concepto del movimiento"></textarea>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Tercero */}
        {showThirdParty && (
          <div id="third_party" className="card bg-base-100 shadow-md mb-6">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4" id="third_party_label">{thirdPartyTitle}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="floating-label">
                  <select name="third_party_id" id="third_party_id" className="select select-md w-full" defaultValue="">
                    <option value="" disabled>Seleccionar</option>
                    <option>Proveedor A</option>
                    <option>Proveedor B</option>
                    <option>Proveedor C</option>
                  </select>
                  <span id="third_party_id_label">{thirdPartyTitle}</span>
                </label>
                <label className="floating-label">
                  <span>N° Documento</span>
                  <input name="third_party_document" id="third_party_document" type="text" placeholder="N° Documento" className="input input-md w-full" />
                </label>
                <label className="floating-label">
                  <span>Teléfono</span>
                  <input name="third_party_phone" id="third_party_phone" type="text" placeholder="Teléfono" className="input input-md w-full" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Detalle de Productos */}
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Detalle de Productos</h3>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="w-2/5">Producto</th>
                    <th className="w-1/6">Cantidad</th>
                    <th className="w-1/6" id="unit_cost_header">{unitCostHeader}</th>
                    <th className="w-1/6">Subtotal</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody id="items_container">
                  {items.map(p => {
                    const subtotal = p.quantity * p.unit_cost;
                    return (
                      <tr key={p.id}>
                        <td>
                          <select
                            name="items[].product_id"
                            className="select select-md w-full"
                            value={p.product_id}
                            onChange={e => handleItemChange(p.id, 'product_id', e.target.value)}
                          >
                            <option value="" disabled>Seleccionar</option>
                            {PRODUCT_OPTIONS.map(op => (
                              <option key={op} value={op}>{op}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            name="items[].quantity"
                            type="number"
                            className="input input-md w-full"
                            placeholder="0"
                            min={0}
                            step={0.01}
                            value={p.quantity}
                            onChange={e => handleItemChange(p.id, 'quantity', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <input
                            name="items[].unit_cost"
                            type="number"
                            className="input input-md w-full"
                            placeholder="0.00"
                            min={0}
                            step={0.01}
                            value={p.unit_cost}
                            onChange={e => handleItemChange(p.id, 'unit_cost', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <input
                            name="items[].subtotal"
                            type="text"
                            className="input input-md w-full"
                            placeholder="0.00"
                            readOnly
                            value={`$${subtotal.toFixed(2)}`}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm btn-square"
                              disabled={items.length === 1}
                              onClick={() => handleRemoveRow(p.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button type="button" id="items_add" className="btn btn-outline btn-sm" onClick={handleAddRow}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar Producto
              </button>
              <div className="text-right">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-xl font-bold ml-2" id="items_total">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Configuración */}
        <div className="card bg-base-100 shadow-md mb-10">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Configuración</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="floating-label">
                <select
                  name="valuation_method"
                  id="valuation_method"
                  className="select select-md w-full"
                  value={valuationMethod}
                  onChange={e => setValuationMethod(e.target.value)}
                  required
                >
                  <option value="promedio">Promedio Ponderado</option>
                  <option value="peps">PEPS</option>
                  <option value="ueps">UEPS</option>
                  <option value="costo-promedio">Costo Promedio</option>
                </select>
                <span>Método de Valuación</span>
              </label>
              <div>
                <span className="font-medium text-sm block">Permitir salida sin stock</span>
                <div className="flex items-center gap-3 h-10">
                  <input
                    name="allow_out_of_stock"
                    id="allow_out_of_stock"
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={allowOutOfStock}
                    onChange={e => setAllowOutOfStock(e.target.checked)}
                  />
                  <span className="text-sm font-light">{allowOutOfStock ? 'Sí' : 'No'}</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-sm block">Generar movimiento inverso al anular</span>
                <div className="flex items-center gap-3 h-10">
                  <input
                    name="generate_reverse_movement"
                    id="generate_reverse_movement"
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={generateReverse}
                    onChange={e => setGenerateReverse(e.target.checked)}
                  />
                  <span className="text-sm font-light">{generateReverse ? 'Sí' : 'No'}</span>
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="floating-label">
                  <span>Observaciones</span>
                  <textarea name="observations" id="observations" className="textarea textarea-md w-full h-24" placeholder="Observaciones adicionales"></textarea>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
            </svg>
            Registrar Movimiento
          </button>
          <button type="reset" className="btn btn-soft">Cancelar</button>
        </div>
      </form>
    </>
  );
}
