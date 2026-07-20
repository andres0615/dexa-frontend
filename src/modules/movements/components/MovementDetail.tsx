import { useFieldArray } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { CreateMovementPayload } from '@/types/movements';
import ProductAutocomplete from '@/components/ui/ProductAutocomplete';

interface MovementDetailProps {
  control: Control<CreateMovementPayload>;
  register: UseFormRegister<CreateMovementPayload>;
  errors: FieldErrors<CreateMovementPayload>;
  setValue: UseFormSetValue<CreateMovementPayload>;
  watch: UseFormWatch<CreateMovementPayload>;
  unitCostHeader: string;
}

function calculateSubtotal(quantity: number, unitCost: number): number {
  return (Number(quantity) || 0) * (Number(unitCost) || 0);
}

export default function MovementDetail({ control, register, errors, setValue, watch, unitCostHeader }: MovementDetailProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const watchedDetails = watch('details');
  const total = (watchedDetails || []).reduce((acc, d) => {
    const qty = Number(d.quantity) || 0;
    const cost = Number(d.unit_cost) || 0;
    return acc + qty * cost;
  }, 0);

  // Agregar fila
  function handleAddRow() {
    append({ product_id: null, quantity: 1, unit_cost: 0, subtotal: 0 });
  }

  // Eliminar fila
  function handleRemoveRow(index: number) {
    if (fields.length <= 1) return;
    remove(index);
  }
  return (
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
              {fields.map((field, index) => {
                const subtotal = calculateSubtotal(
                  watchedDetails?.[index]?.quantity,
                  watchedDetails?.[index]?.unit_cost
                );
                return (
                  <tr key={field.id} className="[&>td]:align-top">
                    <td>
                      <ProductAutocomplete
                        registration={register(`details.${index}.product_id`, { required: 'El producto es requerido' })}
                        value={field.product_id}
                        onChange={(product) => {
                          if (product) {
                            setValue(`details.${index}.product_id`, product.id)
                            setValue(`details.${index}.unit_cost`, product.cost_price as number)
                          } else {
                            setValue(`details.${index}.product_id`, null);
                            setValue(`details.${index}.unit_cost`, 0);
                          }
                        }}
                        error={errors.details?.[index]?.product_id}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className={`input input-md w-full ${errors.details?.[index]?.quantity ? 'input-error' : ''}`}
                        placeholder="0"
                        min={0}
                        step={1}
                        {...register(`details.${index}.quantity`, { required: 'La cantidad es requerida', min: { value: 0.01, message: 'Debe ser mayor a 0' }, valueAsNumber: true })}
                      />
                      {errors.details?.[index]?.quantity && (
                        <p className="text-error text-xs mt-1">{errors.details?.[index]?.quantity?.message}</p>
                      )}
                    </td>
                    <td>
                      <input
                        type="number"
                        className={`input input-md w-full ${errors.details?.[index]?.unit_cost ? 'input-error' : ''}`}
                        placeholder="0.00"
                        min={0}
                        step={1}
                        {...register(`details.${index}.unit_cost`, { required: 'El costo es requerido', min: { value: 0, message: 'No puede ser negativo' }, valueAsNumber: true })}
                      />
                      {errors.details?.[index]?.unit_cost && (
                        <p className="text-error text-xs mt-1">{errors.details?.[index]?.unit_cost?.message}</p>
                      )}
                    </td>
                    <td>
                      <input
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
                        disabled={fields.length === 1}
                        onClick={() => handleRemoveRow(index)}
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
  );
}