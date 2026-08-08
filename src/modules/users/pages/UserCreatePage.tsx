import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../../../services/userService';
import { useToast } from '../../../components/toast/ToastContext';
import UserForm from '../components/UserForm';
import type { CreateUserPayload } from '../../../types/user';

export default function UserCreatePage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // valores demo para propositos de prueba
    const demoValues: any = {
        name: "Test",
        email: "test@example.com",
        password: "manzana12345",
        password_confirmation: "manzana12345",
    };

    const handleSubmit = async (data: CreateUserPayload) => {
        console.log('Payload:', data);

        try {
            await createUser(data);
            showToast('Usuario creado exitosamente', 'success');
            navigate('/users');
        } catch (error) {
            console.error(error);
            showToast('Error al crear el usuario: ' + (error as Error).message, 'error');
        }
    };

    return (
        <>
            {/* Breadcrumbs */}
            <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
                <ul>
                    <li><Link to="/users">Usuarios</Link></li>
                    <li className="text-base-content/70">Crear</li>
                </ul>
            </nav>

            <h2 className="text-2xl font-bold mb-8">Crear Usuario</h2>
            <UserForm
                onSubmit={handleSubmit}
                submitLabel="Guardar"
                defaultValues={demoValues}
            />
        </>
    );
}
