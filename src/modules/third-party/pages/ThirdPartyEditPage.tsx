import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { ThirdParty, CreateThirdPartyPayload, UpdateThirdPartyPayload } from '../../../types/third-party';
import { fetchThirdParty, updateThirdParty } from '../../../services/thirdPartyService';
import { useToast } from '../../../components/toast/ToastContext';
import ThirdPartyForm from '../components/ThirdPartyForm';

export default function ThirdPartyEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [thirdParty, setThirdParty] = useState<ThirdParty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validar que el ID esté presente en la URL
    if (!id) return;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setError('ID de tercero inválido');
      return;
    }

    // Iniciar la carga
    setLoading(true);
    setError(null);

    // Obtener el tercero desde la API
    fetchThirdParty(numericId)
      .then((thirdParty) => {
        // Aquí puedes hacer algo con el tercero obtenido
        console.log('Tercero obtenido:', thirdParty);
        setThirdParty(thirdParty);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: UpdateThirdPartyPayload) => {
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    try {
      await updateThirdParty(numericId, data);
      showToast('Tercero actualizado exitosamente', 'success');
      // navigate('/third-party');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar el tercero', 'error');
    }
  };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-20">
//         <span className="loading loading-spinner loading-lg text-primary"></span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 gap-4">
//         <p className="text-error">{error}</p>
//         <Link to="/third-party" className="btn btn-soft">Volver a Terceros</Link>
//       </div>
//     );
//   }

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/third-party">Terceros</Link></li>
          <li className="text-base-content/70">Editar: {thirdParty?.name}</li>
        </ul>
      </nav>

      <h2 className="text-2xl font-bold mb-8">Editar Tercero</h2>

      <ThirdPartyForm
        onSubmit={handleSubmit}
        submitLabel="Actualizar"
        defaultValues={thirdParty ?? undefined}
        isEdit={true}
      />
    </>
  );
}
