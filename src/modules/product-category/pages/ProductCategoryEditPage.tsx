import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { ProductCategory, UpdateProductCategoryPayload } from '../../../types/product-category';
import { fetchProductCategory, updateProductCategory } from '../../../services/productCategoryService';
import { useToast } from '../../../components/toast/ToastContext';
import ProductCategoryForm from '../components/ProductCategoryForm';

export default function ProductCategoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validar que el ID esté presente en la URL
    if (!id) return;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setError('ID de categoría inválido');
      return;
    }

    // Iniciar la carga
    setLoading(true);
    setError(null);

    // Obtener la categoría desde la API
    fetchProductCategory(numericId)
      .then((category) => {
        // Aquí puedes hacer algo con la categoría obtenida
        console.log('Categoría obtenida:', category);
        setCategory(category);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: UpdateProductCategoryPayload) => {
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    try {
      await updateProductCategory(numericId, data);
      showToast('Categoría actualizada exitosamente', 'success');
      // navigate('/product-category');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar la categoría', 'error');
    }
  };

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/product-category">Categorías</Link></li>
          <li className="text-base-content/70">Editar: {category?.name}</li>
        </ul>
      </nav>

      <h2 className="text-2xl font-bold mb-8">Editar Categoría</h2>

      <ProductCategoryForm
        onSubmit={handleSubmit}
        submitLabel="Actualizar"
        defaultValues={category ?? undefined}
        isEdit={true}
      />
    </>
  );
}
