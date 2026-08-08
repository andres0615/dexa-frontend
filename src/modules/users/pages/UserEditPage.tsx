import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { User, UpdateUserPayload } from '../../../types/user';
import { fetchUser, updateUser } from '../../../services/userService';
import { useToast } from '../../../components/toast/ToastContext';
import UserForm from '../components/UserForm';

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validar que el ID esté presente en la URL
    if (!id) return;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setError('ID de usuario inválido');
      return;
    }

    // Iniciar la carga
    setLoading(true);
    setError(null);

    // Obtener el usuario desde la API
    fetchUser(numericId)
      .then((user) => {
        // Aquí puedes hacer algo con el usuario obtenido
        console.log('Usuario obtenido:', user);
        setUser(user);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: UpdateUserPayload) => {
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    try {
      await updateUser(numericId, data);
      showToast('Usuario actualizado exitosamente', 'success');
      // navigate('/users');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar el usuario', 'error');
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
//         <Link to="/users" className="btn btn-soft">Volver a Usuarios</Link>
//       </div>
//     );
//   }

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/users">Usuarios</Link></li>
          <li className="text-base-content/70">Editar: {user?.name}</li>
        </ul>
      </nav>

      <h2 className="text-2xl font-bold mb-8">Editar Usuario</h2>

      <UserForm
        onSubmit={handleSubmit}
        submitLabel="Actualizar"
        defaultValues={user ?? undefined}
        isEdit={true}
      />
    </>
  );
}
