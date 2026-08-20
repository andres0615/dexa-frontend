import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateThirdPartyPayload, UpdateThirdPartyPayload } from '@/types/third-party';
import ToggleField from '@/components/ui/ToggleField';
import { fetchThirdPartyTypes } from '@/services/thirdPartyTypeService';
import type { ThirdPartyType } from '@/types/third-party-type';
import { Link } from 'react-router-dom';

interface ThirdPartyFormProps {
    onSubmit: (data: CreateThirdPartyPayload | UpdateThirdPartyPayload) => Promise<void>;
    defaultValues?: Partial<CreateThirdPartyPayload>;
    submitLabel?: string;
    isEdit?: boolean;
}

export default function ThirdPartyForm({
    onSubmit: parentOnSubmit,
    defaultValues,
    submitLabel = 'Guardar',
    isEdit = false,
}: ThirdPartyFormProps) {
    // Valores por defecto fusionados con los defaultValues del padre.
    // Garantiza valores iniciales aunque el padre no los provea.
    const mergedDefaults: any = {
        is_active: 1,
        ...defaultValues,
    };

    // Uso de useForm
    // "values" en vez de "defaultValues" para que el formulario
    // se re-renderice cuando cambien los props externos (ej. carga asíncrona del tercero).
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<CreateThirdPartyPayload>({
        values: mergedDefaults,
    });

    // Estado para los tipos de tercero cargados desde el backend.
    // Se cargan aquí para que el formulario sea autocontenido.
    const [thirdPartyTypes, setThirdPartyTypes] = useState<ThirdPartyType[]>([]);
    const [typesError, setTypesError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        fetchThirdPartyTypes()
            .then((types) => {
              console.log('types: ', types);
              
                if (active) setThirdPartyTypes(types);
            })
            .catch((err: Error) => {
                if (active) setTypesError(err.message);
            });
        return () => {
            active = false;
        };
    }, []);

    // cargar valores demo de los select
    useEffect(() => {
        setValue("third_party_type_id", mergedDefaults.third_party_type_id);
    }, [thirdPartyTypes]);

    // is_active es number en el tipo, pero el ToggleField produce booleano,
    // por lo que se convierte a 1/0 antes de enviar al backend.
    const onSubmit = async (data: CreateThirdPartyPayload | UpdateThirdPartyPayload) => {
        const payload: CreateThirdPartyPayload | UpdateThirdPartyPayload = {
            ...data,
            is_active: data.is_active ? 1 : 0,
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
                                <span>Tipo de Tercero</span>
                                <select
                                    className={`select select-md w-full ${errors.third_party_type_id ? 'select-error' : ''}`}
                                    {...register('third_party_type_id', {
                                        required: 'El tipo de tercero es requerido',
                                        valueAsNumber: true,
                                    })}
                                >
                                    <option value="">Seleccione tipo</option>
                                    {thirdPartyTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </label>
                            {errors.third_party_type_id && <p className="text-error text-xs mt-1">{errors.third_party_type_id.message}</p>}
                            {typesError && <p className="text-error text-xs mt-1">{typesError}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Documento / Identificación</span>
                                <input type="text"
                                    placeholder="Documento / Identificación"
                                    className={`input input-md w-full ${errors.tax_id ? 'input-error' : ''}`}
                                    {...register('tax_id', { required: 'El documento es requerido' })} />
                            </label>
                            {errors.tax_id && <p className="text-error text-xs mt-1">{errors.tax_id.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Email</span>
                                <input type="email"
                                    placeholder="Email"
                                    className={`input input-md w-full ${errors.email ? 'input-error' : ''}`}
                                    {...register('email', {
                                        required: 'El email es requerido',
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: 'El email no es válido',
                                        },
                                    })} />
                            </label>
                            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Teléfono</span>
                                <input type="text"
                                    placeholder="Teléfono"
                                    className={`input input-md w-full ${errors.phone ? 'input-error' : ''}`}
                                    {...register('phone', { required: 'El teléfono es requerido' })} />
                            </label>
                            {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                        <div className="md:col-span-3">
                            <label className="floating-label">
                                <span>Dirección</span>
                                <textarea className={`textarea textarea-md w-full h-24 ${errors.address ? 'textarea-error' : ''}`}
                                    placeholder="Dirección"
                                    {...register('address', { required: 'La dirección es requerida' })}></textarea>
                            </label>
                            {errors.address && <p className="text-error text-xs mt-1">{errors.address.message}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Estado y Notas */}
            <div className="card bg-base-100 shadow-md mb-10">
                <div className="card-body">
                    <h3 className="card-title text-lg mb-4">Estado y Notas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <span className="font-medium text-sm block">Activo</span>
                            <div className="flex items-center gap-3 h-10">
                                <ToggleField registration={register('is_active')} checked={watch('is_active')} />
                            </div>
                        </div>
                        <div className="md:col-span-3">
                            <label className="floating-label">
                                <span>Notas</span>
                                <textarea className={`textarea textarea-md w-full h-24 ${errors.notes ? 'textarea-error' : ''}`}
                                    placeholder="Notas"
                                    {...register('notes', { required: 'Las notas son requeridas' })}></textarea>
                            </label>
                            {errors.notes && <p className="text-error text-xs mt-1">{errors.notes.message}</p>}
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
                <Link to="/third-party" className="btn btn-soft">
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
