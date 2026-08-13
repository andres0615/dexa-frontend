import { Link, useNavigate } from 'react-router-dom';
import { createProductCategory } from '../../../services/productCategoryService';
import { useToast } from '../../../components/toast/ToastContext';
import ProductCategoryForm from '../components/ProductCategoryForm';
import type { CreateProductCategoryPayload } from '../../../types/product-category';

export default function ProductCategoryCreatePage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleSubmit = async (data: CreateProductCategoryPayload) => {
        console.log('Payload:', data);

        try {
            await createProductCategory(data);
            showToast('Categoría creada exitosamente', 'success');
            navigate('/product-category');
        } catch (error) {
            console.error(error);
            showToast('Error al crear la categoría: ' + (error as Error).message, 'error');
        }
    };

    return (
        <>
            {/* Breadcrumbs */}
            <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
                <ul>
                    <li><Link to="/product-category">Categorías</Link></li>
                    <li className="text-base-content/70">Crear</li>
                </ul>
            </nav>

            <h2 className="text-2xl font-bold mb-8">Crear Categoría</h2>
            <ProductCategoryForm
                onSubmit={handleSubmit}
                submitLabel="Guardar"
            />
        </>
    );
}
