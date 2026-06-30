import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { Product, CreateProductPayload, UpdateProductPayload } from '../../../types/product';
import { fetchProduct, updateProduct } from '../../../services/productService';
import { useToast } from '../../../components/toast/ToastContext';
import ProductForm from '../components/ProductForm';

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validar que el ID esté presente en la URL
    if (!id) return;

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setError('ID de producto inválido');
      return;
    }

    // Iniciar la carga
    setLoading(true);
    setError(null);

    // Obtener el producto desde la API
    fetchProduct(numericId)
      .then((product) => {
        // Aquí puedes hacer algo con el producto obtenido
        console.log('Producto obtenido:', product);
        setProduct(product);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: UpdateProductPayload) => {
    if (!id) return;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return;

    try {
      await updateProduct(numericId, data);
      showToast('Producto actualizado exitosamente', 'success');
      // navigate('/products');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar el producto', 'error');
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
//         <Link to="/products" className="btn btn-soft">Volver a Productos</Link>
//       </div>
//     );
//   }

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
        <ul>
          <li><Link to="/products">Productos</Link></li>
          <li className="text-base-content/70">Editar: {product?.name}</li>
        </ul>
      </nav>

      <h2 className="text-2xl font-bold mb-8">Editar Producto</h2>

      <ProductForm
        onSubmit={handleSubmit}
        submitLabel="Actualizar"
        defaultValues={product ?? undefined}
      />
    </>
  );
}