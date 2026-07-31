import { useNavigate, Link } from 'react-router-dom';
import { createMovement } from '@/services/movementService';
import { useToast } from '@/components/toast/ToastContext';
import MovementForm from '../components/MovementForm';
import type { CreateMovementPayload } from '@/types/movements';
import { DEMO_VALUES } from '@/constants/global';

export default function MovementCreatePage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // valores demo para propositos de prueba
    const demoValues: any = {
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
      details: [{ product_id: null, quantity: 1, unit_cost: 0, subtotal: 0 }],
    };

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
                defaultValues={demoValues}
            />
        </>
    );
}
