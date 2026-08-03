import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { Movement, UpdateMovementPayload } from '@/types/movements';
import { fetchMovement, updateMovement } from '@/services/movementService';
import { useToast } from '@/components/toast/ToastContext';
import MovementForm from '../components/MovementForm';
import { formatDateToInput } from '@/utils/utils';

export default function MovementEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [movement, setMovement] = useState<Movement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validar que el ID esté presente en la URL
    if (!id) return;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setError('ID de movimiento inválido');
      return;
    }

    // Iniciar la carga
    setLoading(true);
    setError(null);

    // Obtener el movimiento desde la API
    fetchMovement(numericId)
      .then((movement) => {
        // Aquí puedes hacer algo con el movimiento obtenido
        console.log('Movimiento obtenido:', movement);
        setMovement({
          ...movement,
          // formatear la fecha para el input date
          movement_date: formatDateToInput(movement.movement_date)
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: UpdateMovementPayload) => {
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    try {
      await updateMovement(numericId, data);
      showToast('Movimiento actualizado exitosamente', 'success');
      navigate('/movements');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar el movimiento', 'error');
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
//         <Link to="/movements" className="btn btn-soft">Volver a Movimientos</Link>
//       </div>
//     );
//   }

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/movements">Movimientos de Inventario</Link></li>
          <li className="text-base-content/70">Editar</li>
        </ul>
      </nav>

      <h2 className="text-2xl font-bold mb-8">Editar Movimiento de Inventario</h2>

      <MovementForm
        onSubmit={handleSubmit}
        submitLabel="Actualizar"
        defaultValues={movement ?? undefined}
      />
    </>
  );
}
