import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateMovementPayload } from '@/types/movements';
import type { MovementType } from '@/types/movement-types';
import { fetchMovementTypes } from '@/services/movementTypeService';
import { MOVEMENT_TYPE_IDS, TIPOS_TERCERO, DEMO_VALUES } from '@/constants/global';
import type { Warehouse } from '@/types/warehouse';
import { fetchWarehouses } from '@/services/warehouseService';
import type { ThirdParty } from '@/types/third-party';
import { fetchThirdParties } from '@/services/thirdPartyService';
import ToggleField from '@/components/ui/ToggleField';
import { createMovement } from '@/services/movementService';
import { useToast } from '@/components/toast/ToastContext';
import type { CreateMovementDetailPayload } from '@/types/movement-detail';
import ProductAutocomplete from '@/components/ui/ProductAutocomplete';

// interface ItemRow {
//   id: string;
//   product_id: string;
//   quantity: number;
//   unit_cost: number;
// }

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
  const { showToast } = useToast();
  // const mergedDefaults: any = {
  //   movement_type_id: null,
  //   adjustment_is_entry: false,
  //   movement_date: '',
  //   voucher: null,
  //   source_warehouse_id: null,
  //   destination_warehouse_id: null,
  //   original_voucher: null,
  //   third_party_id: null,
  //   third_party_document: null,
  //   third_party_phone: null,
  //   note: null,
  //   valuation_method: 'promedio',
  //   allow_out_of_stock: false,
  //   generate_reverse_movement: true,
  //   observations: null,
  // };
  
  // Valores demo
  const mergedDefaults: any = {
    movement_type_id: DEMO_VALUES.movement_type_id,
    adjustment_is_entry: false,
    movement_date: new Date().toISOString().split('T')[0],
    voucher: 'FV-001-00000123',
    source_warehouse_id: null,
    destination_warehouse_id: DEMO_VALUES.destination_warehouse_id,
    original_voucher: null,
    third_party_id: DEMO_VALUES.third_party_id,
    third_party_document: '12345678',
    third_party_phone: '999888777',
    note: 'Compra de prueba — verificar flujo completo',
    valuation_method: 'promedio',
    allow_out_of_stock: false,
    generate_reverse_movement: true,
    observations: 'Observaciones de prueba',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateMovementPayload>({
    values: mergedDefaults,
    // defaultValues: mergedDefaults,
  });

  const movementType = watch('movement_type_id');
  const [items, setItems] = useState<CreateMovementDetailPayload[]>([
    { product_id: null, quantity: 1, unit_cost: 0, subtotal: 0 },
  ]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [customers, setCustomers] = useState<ThirdParty[]>([]);
  const [suppliers, setSuppliers] = useState<ThirdParty[]>([]);

  // Mostrar u ocultar campos según el tipo de movimiento
  const showAdjustmentToggle = movementType === MOVEMENT_TYPE_IDS.AJUSTE;
  const showSourceWarehouse = movementType === MOVEMENT_TYPE_IDS.VENTA
    || movementType === MOVEMENT_TYPE_IDS.AJUSTE
    || movementType === MOVEMENT_TYPE_IDS.TRASLADO;
  const showDestinationWarehouse = movementType === MOVEMENT_TYPE_IDS.COMPRA
    || movementType === MOVEMENT_TYPE_IDS.DEVOLUCION
    || movementType === MOVEMENT_TYPE_IDS.TRASLADO;
  const showOriginalVoucher = movementType === MOVEMENT_TYPE_IDS.DEVOLUCION;
  const showThirdParty = movementType !== MOVEMENT_TYPE_IDS.AJUSTE && movementType !== MOVEMENT_TYPE_IDS.TRASLADO && movementType !== null;
  const showCustomers = movementType === MOVEMENT_TYPE_IDS.VENTA;
  const showSuppliers = movementType === MOVEMENT_TYPE_IDS.COMPRA;

  // Cambio de textos según el tipo de movimiento
  const thirdPartyTitle = movementType === MOVEMENT_TYPE_IDS.VENTA ? 'Cliente' : 'Proveedor';
  const unitCostHeader = movementType === MOVEMENT_TYPE_IDS.VENTA ? 'Precio Unitario' : 'Costo Unitario';

  const [movementTypes, setMovementTypes] = useState<MovementType[]>([]);

  const total = items.reduce((acc, p) => acc + p.quantity * p.unit_cost, 0);

  // Manejar cambios en los items
  function handleItemChange(keyId: string, field: 'product_id' | 'quantity' | 'unit_cost', value: string | number) {
    setItems(prev => prev.map(p =>
      p.keyId === keyId ? { ...p, [field]: value } : p
    ));
  }

  function handleProductChange(keyId: string, productId: number | null) {
    console.log('productId', productId);
    
    handleItemChange(keyId, 'product_id', productId);
  }

  // Agregar fila
  function handleAddRow() {
    setItems(prev => [...prev, { keyId: generateId(), product_id: null, quantity: 1, unit_cost: 0, subtotal: 0 }]);
  }

  // Eliminar fila
  function handleRemoveRow(keyId: string) {
    setItems(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(p => p.keyId !== keyId);
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

  // Cargar los almacenes
  useEffect(() => {
    fetchWarehouses()
      .then((result) => {
        console.log('warehouses: ', result);        
        setWarehouses(result);
      })
      .catch((err) => console.error(err))
      .finally(() => { });
  }, []);

  // Cargar los clientes
  useEffect(() => {
    fetchThirdParties({ third_party_type_id: TIPOS_TERCERO.CLIENTE })
      .then((result) => {
        console.log('customers: ', result);        
        setCustomers(result);
      })
      .catch((err) => console.error(err))
      .finally(() => { });
  }, []);

  // Cargar los proveedores
  useEffect(() => {
    fetchThirdParties({ third_party_type_id: TIPOS_TERCERO.PROVEEDOR })
      .then((result) => {
        console.log('suppliers: ', result);        
        setSuppliers(result);
      })
      .catch((err) => console.error(err))
      .finally(() => { });
  }, []);

  // cargar valores demo de los select
  useEffect(() => {
    setValue("movement_type_id", mergedDefaults.movement_type_id);
    setValue("destination_warehouse_id", mergedDefaults.destination_warehouse_id);
    setValue("third_party_id", mergedDefaults.third_party_id);
  }, [movementTypes, customers, suppliers, warehouses]);

  // Select para tipos de movimientos
  const movementTypesSelect = (
    <label className="floating-label">
      <select
        className={`select select-md w-full ${errors.movement_type_id ? 'select-error' : ''}`}
        {...register('movement_type_id', {
          required: 'El tipo de movimiento es requerido',
          setValueAs: (v: string) => v === '' ? undefined : Number(v),
        })}
      >
        <option value="">Seleccionar</option>
        {movementTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
      <span>Tipo de Movimiento</span>
      {errors.movement_type_id && (
        <p className="text-error text-xs mt-1">{errors.movement_type_id.message}</p>
      )}
    </label>
  );

  const onSubmit = async (data: any) => {
    const payload: CreateMovementPayload = {
      movement_type_id: data.movement_type_id,
      adjustment_is_entry: data.adjustment_is_entry,
      movement_date: data.movement_date,
      voucher: data.voucher || null,
      source_warehouse_id: data.source_warehouse_id || null,
      destination_warehouse_id: data.destination_warehouse_id || null,
      original_voucher: data.original_voucher || null,
      third_party_id: data.third_party_id ?? null,
      third_party_document: data.third_party_document || null,
      third_party_phone: data.third_party_phone || null,
      note: data.note || null,
      valuation_method: data.valuation_method,
      allow_out_of_stock: data.allow_out_of_stock,
      generate_reverse_movement: data.generate_reverse_movement,
      observations: data.observations || null,
      // Detalles del movimiento
      details: items
    };
    console.log('Payload:', payload);

    try {
      await createMovement(payload);
      showToast('Movimiento creado exitosamente', 'success');
      // navigate('/movements');
    } catch (error) {
      console.error(error);
      showToast('Error al crear el movimiento', 'error');
    }
  };

  // const productSelect = (
  //   <select
  //     name="items[].product_id"
  //     className="select select-md w-full"
  //     value={p.product_id}
  //     onChange={e => handleProductChange(p.keyId, Number(e.target.value))}
  //   >
  //     <option value="" disabled>Seleccionar</option>
  //     {PRODUCT_OPTIONS.map(op => (
  //       <option key={op} value='1'>{op}</option>
  //     ))}
  //   </select>
  // );

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
      <form onSubmit={handleSubmit(onSubmit)}>
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
                      type="checkbox"
                      className="toggle toggle-primary"
                      {...register('adjustment_is_entry')}
                    />
                    <span className="text-sm font-light">{watch('adjustment_is_entry') ? 'Entrada' : 'Salida'}</span>
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
                <input
                  type="date"
                  className={`input input-md w-full ${errors.movement_date ? 'input-error' : ''}`}
                  {...register('movement_date', { required: 'La fecha es requerida' })}
                />
                {errors.movement_date && (
                  <p className="text-error text-xs mt-1">{errors.movement_date.message}</p>
                )}
              </label>
              <label className="floating-label">
                <span>N° Comprobante / Factura</span>
                <input
                  type="text"
                  placeholder="N° Comprobante / Factura"
                  className="input input-md w-full"
                  {...register('voucher')}
                />
              </label>
              {showSourceWarehouse && (
                <div id="source_warehouse_id">
                  <label className="floating-label">
                    <select
                      className={`select select-md w-full ${errors.source_warehouse_id ? 'select-error' : ''}`}
                      {...register('source_warehouse_id', {
                        required: showSourceWarehouse ? 'El almacén origen es requerido' : false,
                        setValueAs: (v: string) => v === '' ? null : Number(v),
                      })}
                    >
                      <option value="">Seleccionar</option>
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </option>
                      ))}
                    </select>
                    <span>Almacén Origen</span>
                    {errors.source_warehouse_id && (
                      <p className="text-error text-xs mt-1">{errors.source_warehouse_id.message}</p>
                    )}
                  </label>
                </div>
              )}

              {showDestinationWarehouse && (
                <div id="destination_warehouse_id">
                  <label className="floating-label">
                    <select
                      className={`select select-md w-full ${errors.destination_warehouse_id ? 'select-error' : ''}`}
                      {...register('destination_warehouse_id', {
                        required: showDestinationWarehouse ? 'El almacén destino es requerido' : false,
                        setValueAs: (v: string) => v === '' ? null : Number(v),
                      })}
                    >
                      <option value="">Seleccionar</option>
                      {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </option>
                      ))}
                    </select>
                    <span>Almacén Destino</span>
                    {errors.destination_warehouse_id && (
                      <p className="text-error text-xs mt-1">{errors.destination_warehouse_id.message}</p>
                    )}
                  </label>
                </div>
              )}

              {showOriginalVoucher && (
                <div id="original_voucher_wrapper" className="md:col-span-3">
                  <label className="floating-label">
                    <span>Comprobante Original</span>
                    <input
                      type="text"
                      placeholder="N° de comprobante que origina la devolución"
                      className="input input-md w-full"
                      {...register('original_voucher')}
                    />
                  </label>
                </div>
              )}

              <div className="md:col-span-3">
                <label className="floating-label">
                  <span>Nota / Concepto</span>
                  <textarea
                    className="textarea textarea-md w-full h-24"
                    placeholder="Nota o concepto del movimiento"
                    {...register('note')}
                  ></textarea>
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
                {/* Clientes */}
                {showCustomers && (
                  <label className="floating-label">
                    <select
                      className={`select select-md w-full ${errors.third_party_id ? 'select-error' : ''}`}
                      {...register('third_party_id', {
                        required: showCustomers ? 'El cliente es requerido' : false,
                        setValueAs: (v: string) => v === '' ? null : Number(v),
                      })}
                    >
                      <option value="">Seleccionar</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                    <span>Cliente</span>
                    {errors.third_party_id && (
                      <p className="text-error text-xs mt-1">{errors.third_party_id.message}</p>
                    )}
                  </label>
                )}
                {/* Proveedores */}
                {showSuppliers && (
                  <label className="floating-label">
                    <select
                      className={`select select-md w-full ${errors.third_party_id ? 'select-error' : ''}`}
                      {...register('third_party_id', {
                        required: showSuppliers ? 'El proveedor es requerido' : false,
                        setValueAs: (v: string) => v === '' ? null : Number(v),
                      })}
                    >
                      <option value="">Seleccionar</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    <span>Proveedor</span>
                    {errors.third_party_id && (
                      <p className="text-error text-xs mt-1">{errors.third_party_id.message}</p>
                    )}
                  </label>
                )}
                <label className="floating-label">
                  <span>N° Documento</span>
                  <input
                    type="text"
                    placeholder="N° Documento"
                    className="input input-md w-full"
                    {...register('third_party_document')}
                  />
                </label>
                <label className="floating-label">
                  <span>Teléfono</span>
                  <input
                    type="text"
                    placeholder="Teléfono"
                    className="input input-md w-full"
                    {...register('third_party_phone')}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Detalle de Productos */}
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Detalle de Productos</h3>
            <div>
              <table className="table w-full overflow-x-auto">
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
                      <tr key={p.keyId}>
                        <td>
                          {/*productSelect*/}
                          <ProductAutocomplete
                            registration={register('product_id')}
                            value={p.product_id}
                            onChange={(id) => handleProductChange(p.keyId, id)}
                          />
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
                            onChange={e => handleItemChange(p.keyId, 'quantity', parseFloat(e.target.value) || 0)}
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
                            onChange={e => handleItemChange(p.keyId, 'unit_cost', parseFloat(e.target.value) || 0)}
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
                              onClick={() => handleRemoveRow(p.keyId)}
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
                  className={`select select-md w-full ${errors.valuation_method ? 'select-error' : ''}`}
                  {...register('valuation_method', { required: 'El método de valuación es requerido' })}
                >
                  <option value="promedio">Promedio Ponderado</option>
                  <option value="peps">PEPS</option>
                  <option value="ueps">UEPS</option>
                  <option value="costo-promedio">Costo Promedio</option>
                </select>
                <span>Método de Valuación</span>
                {errors.valuation_method && (
                  <p className="text-error text-xs mt-1">{errors.valuation_method.message}</p>
                )}
              </label>
              <div>
                <span className="font-medium text-sm block">Permitir salida sin stock</span>
                <div className="flex items-center gap-3 h-10">
                  <ToggleField registration={register('allow_out_of_stock')} checked={watch('allow_out_of_stock')} />
                </div>
              </div>
              <div>
                <span className="font-medium text-sm block">Generar movimiento inverso al anular</span>
                <div className="flex items-center gap-3 h-10">
                  <ToggleField registration={register('generate_reverse_movement')} checked={watch('generate_reverse_movement')} />
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="floating-label">
                  <span>Observaciones</span>
                  <textarea
                    className="textarea textarea-md w-full h-24"
                    placeholder="Observaciones adicionales"
                    {...register('observations')}
                  ></textarea>
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
