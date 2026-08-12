import { Link, useNavigate } from 'react-router-dom';
import { createThirdParty } from '../../../services/thirdPartyService';
import { useToast } from '../../../components/toast/ToastContext';
import ThirdPartyForm from '../components/ThirdPartyForm';
import type { CreateThirdPartyPayload } from '../../../types/third-party';

export default function ThirdPartyCreatePage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (data: CreateThirdPartyPayload) => {
        try {
            await createThirdParty(data);
            showToast('Tercero creado exitosamente', 'success');
            navigate('/third-party');
        } catch (error) {
            console.error(error);
            showToast('Error al crear el tercero', 'error');
        }
    };

    return (
        <>
            {/* Breadcrumbs */}
            <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
                <ul>
                    <li><Link to="/third-party">Terceros</Link></li>
                    <li className="text-base-content/70">Crear</li>
                </ul>
            </nav>

            <h2 className="text-2xl font-bold mb-8">Crear Tercero</h2>
            <ThirdPartyForm
                onSubmit={handleSubmit}
                submitLabel="Guardar"
            />
        </>
    );
}
