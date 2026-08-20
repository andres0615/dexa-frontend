import { useForm } from 'react-hook-form';
import type { CreateProductCategoryPayload, UpdateProductCategoryPayload } from '@/types/product-category';
import ToggleField from '@/components/ui/ToggleField';
import { Link } from 'react-router-dom';

interface ProductCategoryFormProps {
    onSubmit: (data: CreateProductCategoryPayload | UpdateProductCategoryPayload) => Promise<void>;
    defaultValues?: Partial<CreateProductCategoryPayload>;
    submitLabel?: string;
    isEdit?: boolean;
}

export default function ProductCategoryForm({
    onSubmit: parentOnSubmit,
    defaultValues,
    submitLabel = 'Guardar',
    isEdit = false,
}: ProductCategoryFormProps) {
    // Valores por defecto fusionados con los defaultValues del padre.
    // Garantiza valores iniciales aunque el padre no los provea.
    const mergedDefaults: any = {
        is_active: true,
        ...defaultValues,
    };

    // Uso de useForm
    // "values" en vez de "defaultValues" para que el formulario
    // se re-renderice cuando cambien los props externos (ej. carga asíncrona de la categoría).
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateProductCategoryPayload | UpdateProductCategoryPayload>({
        values: mergedDefaults,
    });

    // Limpieza: convierte strings vacíos a una cadena vacía segura
    // para no enviar valores indefinidos al backend.
    const onSubmit = async (data: CreateProductCategoryPayload | UpdateProductCategoryPayload) => {
        const payload: CreateProductCategoryPayload | UpdateProductCategoryPayload = {
            ...data,
            description: data.description ?? '',
        };

        await parentOnSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Información General */}
            <div className="card bg-base-100 shadow-md mb-6">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">Información General</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="floating-label">
                                <span>Nombre</span>
                                <input type="text"
                                    placeholder="Nombre"
                                    className={`input input-md w-full ${errors.name ? 'input-error' : ''}`}
                                    {...register('name', { required: 'El nombre es requerido' })} />
                            </label>
                            {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Descripción</span>
                                <textarea
                                    placeholder="Descripción"
                                    className={`textarea textarea-md w-full ${errors.description ? 'textarea-error' : ''}`}
                                    {...register('description')} />
                            </label>
                            {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
                        </div>
                        <div>
                          <span className="font-medium text-sm block">Activo</span>
                          <div className="flex items-center gap-3 h-10">
                            <ToggleField
                              registration={register('is_active')}
                              checked={watch('is_active') ?? true}
                            />
                          </div>
                          {errors.is_active && <p className="text-error text-xs mt-1">{errors.is_active.message}</p>}
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
                <Link to="/product-category" className="btn btn-soft">
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
