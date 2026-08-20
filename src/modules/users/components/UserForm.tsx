import { useForm } from 'react-hook-form';
import type { CreateUserPayload, UpdateUserPayload } from '../../../types/user';
import { Link } from 'react-router-dom';

interface UserFormProps {
    onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
    defaultValues?: Partial<CreateUserPayload>;
    submitLabel?: string;
    isEdit?: boolean;
}

export default function UserForm({
    onSubmit: parentOnSubmit,
    defaultValues,
    submitLabel = 'Guardar',
    isEdit = false,
}: UserFormProps) {
    // Valores por defecto fusionados con los defaultValues del padre.
    // Garantiza valores iniciales aunque el padre no los provea.
    const mergedDefaults: any = {
        ...defaultValues,
    };

    // Uso de useForm
    // "values" en vez de "defaultValues" para que el formulario
    // se re-renderice cuando cambien los props externos (ej. carga asíncrona del usuario).
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateUserPayload|UpdateUserPayload>({
        // defaultValues: mergedDefaults,
        values: mergedDefaults,
    });

    // Limpieza: convierte strings vacíos a null para que el backend
    // los interprete como "sin valor" en vez de cadena vacía.
    const onSubmit = async (data: CreateUserPayload | UpdateUserPayload) => {

        // castear valores nulos
        const payload: CreateUserPayload | UpdateUserPayload = {
            ...data,
            email_verified_at: data.email_verified_at || null,
            remember_token: data.remember_token || null,
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
                                <span>Email</span>
                                <input type="email"
                                    placeholder="Email"
                                    className={`input input-md w-full ${errors.email ? 'input-error' : ''}`}
                                    {...register('email', { required: 'El email es requerido' })} />
                            </label>
                            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="floating-label pb-1.5">
                                <span>Contraseña</span>
                                <input type="password"
                                    placeholder='Contraseña'
                                    className={`input input-md w-full ${errors.password ? 'input-error' : ''}`}
                                    {...register('password', isEdit ? {} : { required: 'La contraseña es requerida' })} />
                            </label>
                            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
                            {isEdit && <p className="label-text-alt text-base-content/60 text-xs">Deja vacío para conservar la contraseña actual</p>}
                        </div>
                        <div>
                            <label className="floating-label">
                                <span>Confirmar Contraseña</span>
                                <input type="password"
                                    placeholder="Confirmar Contraseña"
                                    className={`input input-md w-full ${errors.password_confirmation ? 'input-error' : ''}`}
                                    {...register('password_confirmation', { required: isEdit ? false : 'La confirmación de contraseña es requerida' })} />
                            </label>
                            {errors.password_confirmation && <p className="text-error text-xs mt-1">{errors.password_confirmation.message}</p>}
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
                <Link to="/users" className="btn btn-soft">
                    Cancelar
                </Link>
            </div>
        </form>
    );
}
