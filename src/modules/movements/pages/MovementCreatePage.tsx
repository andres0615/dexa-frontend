import { useNavigate, Link } from 'react-router-dom';
import { createMovement } from '@/services/movementService';
import { useToast } from '@/components/toast/ToastContext';
import MovementForm from '../components/MovementForm';
import type { CreateMovementPayload } from '@/types/movements';

export default function MovementCreatePage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (data: CreateMovementPayload) => {
        console.log('Payload:', data);

        try {
            await createMovement(data);
            showToast('Movimiento creado exitosamente', 'success');
            navigate('/movements');
        } catch (error) {
            console.error(error);
            showToast('Error al crear el movimiento', 'error');
        }
    };

    return (
        <>
            {/* Breadcrumbs */}
            <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
                <ul>
                    <li><Link to="/movements">Movimientos de Inventario</Link></li>
                    <li className="text-base-content/70">Crear</li>
                </ul>
            </nav>

            <h2 className="text-2xl font-bold mb-8">Registrar Movimiento de Inventario</h2>
            <MovementForm
                onSubmit={handleSubmit}
            />
        </>
    );
}
