import { useForm } from 'react-hook-form';
import type { CreateProductPayload, UpdateProductPayload } from '../../../types/product';
import type { ProductStatus } from '../../../types/product-status';
import { ucfirst } from '../../../utils/utils';
import { useEffect, useState } from 'react';
import { fetchProductStatus } from '../../../services/productStatusService';

interface ProductFormProps {
    onSubmit: (data: CreateProductPayload | UpdateProductPayload) => Promise<void>;
    defaultValues?: Partial<CreateProductPayload>;
    submitLabel?: string;
}

export default function ProductForm({
    onSubmit: parentOnSubmit,
    defaultValues,
    submitLabel = 'Guardar',
}: ProductFormProps) {
    // Valores por defecto fusionados con los defaultValues del padre.
    // Garantiza valores iniciales aunque el padre no los provea.
    const mergedDefaults: any = {
        status: 'activo',
        applies_tax: false,
        allow_negative_sales: false,
        is_service: false,
        initial_stock: 0,
        minimum_stock: 0,
        vat_percentage: 0,
        subcategory_id: null,
        ...defaultValues,
    };

    const [productStatuses, setProductStatuses] = useState<ProductStatus[]>([])

    // Uso de useForm
    // "values" en vez de "defaultValues" para que el formulario
    // se re-renderice cuando cambien los props externos (ej. carga asíncrona del producto).
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateProductPayload>({
        // defaultValues: mergedDefaults,
        values: mergedDefaults,
    });

    // Limpieza: convierte strings vacíos a null para que el backend
    // los interprete como "sin valor" en vez de cadena vacía.
    const onSubmit = async (data: CreateProductPayload | UpdateProductPayload) => {

        // castear valores nulos
        const payload: CreateProductPayload | UpdateProductPayload = {
            ...data,
            barcode: data.barcode || null,
            description: data.description || null,
            brand: data.brand || null,
            presentation_unit: data.presentation_unit || null,
            wholesale_price: data.wholesale_price || null,
            maximum_stock: data.maximum_stock || null,
            location: data.location || null,
            supplier_id: data.supplier_id || null,
            notes: data.notes || null,
            subcategory_id: data.subcategory_id || null,
        };

        await parentOnSubmit(payload);
    };

    // Obtener status de productos
      useEffect(() => {
        fetchProductStatus()
          .then((result) => {
            setProductStatuses(result);
          })
          .catch((err) => console.error(err))
          .finally(() => {});
      }, []);

    const statusSelect = (
        <select className="select select-md w-full"
            {...register('status_id', { required: true })}>
            {/* <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option> */}
            {productStatuses.map((status) => (
                <option key={status.id} value={status.id}>
                    {ucfirst(status.name)}
                </option>
            ))}
        </select>
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Información General */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">Información General</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="floating-label">
                                <span>Código / SKU</span>
                                <input type="text"
                                    placeholder="Código / SKU"
                                    className={`input input-md w-full ${errors.code ? 'input-error' : ''}`}
                                    {...register('code', { required: 'El código es requerido' })} />
                            </label>
                            {errors.code && <p className="text-error text-xs mt-1">{errors.code.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Código de Barras</span>
                                <input type="text"
                                    placeholder="Código de Barras"
                                    className="input input-md w-full"
                                    {...register('barcode')} />
                            </label>
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Nombre del Producto</span>
                                <input type="text"
                                    placeholder="Nombre del Producto"
                                    className={`input input-md w-full ${errors.name ? 'input-error' : ''}`}
                                    {...register('name', { required: 'El nombre es requerido' })} />
                            </label>
                            {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="md:col-span-3">
                            <label className="floating-label">
                                <span>Descripción</span>
                                <textarea className="textarea textarea-md w-full h-24"
                                    placeholder="Descripción"
                                    {...register('description')}></textarea>
                            </label>
                        </div>
                        <div>
                            <label className="floating-label">
                                <select className={`select select-md w-full ${errors.category_id ? 'select-error' : ''}`}
                                    {...register('category_id', { required: 'La categoría es requerida', valueAsNumber: true })}>
                                    <option value="">Seleccionar</option>
                                    <option value="1">Ropa</option>
                                    <option value="2">Electrónica</option>
                                    <option value="3">Alimentos</option>
                                    <option value="4">Hogar</option>
                                    <option value="5">Deportes</option>
                                </select>
                                <span>Categoría</span>
                            </label>
                            {errors.category_id && <p className="text-error text-xs mt-1">{errors.category_id.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <select className="select select-md w-full"
                                    {...register('subcategory_id', { valueAsNumber: true })}>
                                    <option value="">Seleccionar</option>
                                    <option value="1">Opción 1</option>
                                    <option value="2">Opción 2</option>
                                    <option value="3">Opción 3</option>
                                </select>
                                <span>Subcategoría</span>
                            </label>
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Marca</span>
                                <input type="text"
                                    placeholder="Marca"
                                    className="input input-md w-full"
                                    {...register('brand')} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unidad y Medidas */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">Unidad y Medidas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="floating-label">
                                <select className={`select select-md w-full ${errors.unit_of_measurement ? 'select-error' : ''}`}
                                    {...register('unit_of_measurement', { required: 'La unidad es requerida' })}>
                                    <option value="">Seleccionar</option>
                                    <option value="UND">UND — Unidad</option>
                                    <option value="KG">KG — Kilogramo</option>
                                    <option value="LT">LT — Litro</option>
                                    <option value="MT">MT — Metro</option>
                                    <option value="CM">CM — Centímetro</option>
                                    <option value="CJA">CJA — Caja</option>
                                    <option value="PAR">PAR — Par</option>
                                </select>
                                <span>Unidad de Medida</span>
                            </label>
                            {errors.unit_of_measurement && <p className="text-error text-xs mt-1">{errors.unit_of_measurement.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Presentación</span>
                                <input type="text"
                                    placeholder="Presentación"
                                    className="input input-md w-full"
                                    {...register('presentation_unit')} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Precios */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">Precios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="floating-label">
                                <span>Precio de Costo</span>
                                <input type="number"
                                    placeholder="Precio de Costo"
                                    className={`input input-md w-full ${errors.cost_price ? 'input-error' : ''}`}
                                    min="0"
                                    step="0.01"
                                    {...register('cost_price', { required: 'El precio de costo es requerido', min: 0 })} />
                            </label>
                            {errors.cost_price && <p className="text-error text-xs mt-1">{errors.cost_price.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Precio de Venta</span>
                                <input type="number"
                                    placeholder="Precio de Venta"
                                    className={`input input-md w-full ${errors.sale_price ? 'input-error' : ''}`}
                                    min="0"
                                    step="0.01"
                                    {...register('sale_price', { required: 'El precio de venta es requerido', min: 0 })} />
                            </label>
                            {errors.sale_price && <p className="text-error text-xs mt-1">{errors.sale_price.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Precio Mayorista</span>
                                <input type="number"
                                    placeholder="Precio Mayorista"
                                    className="input input-md w-full"
                                    min="0"
                                    step="0.01"
                                    {...register('wholesale_price', { min: 0 })} />
                            </label>
                        </div>
                        <div>
                            <span className="font-medium text-sm block">Aplica Impuesto</span>
                            <div className="flex items-center gap-3 h-10">
                                <input type="checkbox"
                                    className="toggle toggle-primary"
                                    {...register('applies_tax')} />
                                <span className="text-sm font-light">No</span>
                            </div>
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>% IVA</span>
                                <input type="number"
                                    placeholder="% IVA"
                                    className="input input-md w-full"
                                    min="0"
                                    step="0.01"
                                    {...register('vat_percentage', { valueAsNumber: true, min: 0 })} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control de Inventario */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">Control de Inventario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="floating-label">
                                <span>Stock Inicial</span>
                                <input type="number"
                                    placeholder="Stock Inicial"
                                    className={`input input-md w-full ${errors.initial_stock ? 'input-error' : ''}`}
                                    min="0"
                                    {...register('initial_stock', { required: 'El stock inicial es requerido', valueAsNumber: true, min: 0 })} />
                            </label>
                            {errors.initial_stock && <p className="text-error text-xs mt-1">{errors.initial_stock.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Stock Mínimo</span>
                                <input type="number"
                                    placeholder="Stock Mínimo"
                                    className={`input input-md w-full ${errors.minimum_stock ? 'input-error' : ''}`}
                                    min="0"
                                    {...register('minimum_stock', { required: 'El stock mínimo es requerido', valueAsNumber: true, min: 0 })} />
                            </label>
                            {errors.minimum_stock && <p className="text-error text-xs mt-1">{errors.minimum_stock.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Stock Máximo</span>
                                <input type="number"
                                    placeholder="Stock Máximo"
                                    className="input input-md w-full"
                                    min="0"
                                    {...register('maximum_stock', { valueAsNumber: true, min: 0 })} />
                            </label>
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Ubicación en Bodega</span>
                                <input type="text"
                                    placeholder="Ubicación en Bodega"
                                    className="input input-md w-full"
                                    {...register('location')} />
                            </label>
                        </div>
                        <div>
                            <label className="floating-label">
                                <select className="select select-md w-full"
                                    {...register('supplier_id', { valueAsNumber: true })}>
                                    <option value="">Seleccionar</option>
                                    <option value="1">Proveedor A</option>
                                    <option value="2">Proveedor B</option>
                                    <option value="3">Proveedor C</option>
                                </select>
                                <span>Proveedor Principal</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuración */}
            <div className="card bg-base-100 shadow-md mb-10">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">Configuración</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <span className="font-medium text-sm block">Vender sin Stock</span>
                            <div className="flex items-center gap-3 h-10">
                                <input type="checkbox"
                                    className="toggle toggle-primary"
                                    {...register('allow_negative_sales')} />
                                <span className="text-sm font-light">No</span>
                            </div>
                        </div>
                        <div>
                            <span className="font-medium text-sm block">Es un Servicio</span>
                            <div className="flex items-center gap-3 h-10">
                                <input type="checkbox"
                                    className="toggle toggle-primary"
                                    {...register('is_service')} />
                                <span className="text-sm font-light">No</span>
                            </div>
                            <p className="label-text-alt text-base-content/60 text-xs">No descuenta inventario</p>
                        </div>
                        <div>
                            <label className="floating-label">
                                {statusSelect}
                                <span>Estado</span>
                            </label>
                        </div>
                        <div className="md:col-span-3">
                            <label className="floating-label">
                                <span>Notas Internas</span>
                                <textarea className="textarea textarea-md w-full h-24"
                                    placeholder="Notas Internas"
                                    {...register('notes')}></textarea>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                    </svg>
                    {submitLabel}
                </button>
                <button type="reset" className="btn btn-soft">Cancelar</button>
            </div>
        </form>
    );
}
