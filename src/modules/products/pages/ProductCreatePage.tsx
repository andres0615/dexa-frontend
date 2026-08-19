import { Link, useNavigate } from 'react-router-dom';
import { createProduct } from '../../../services/productService';
import { useToast } from '../../../components/toast/ToastContext';
import ProductForm from '../components/ProductForm';
import type { CreateProductPayload } from '../../../types/product';
import { USE_DEMO_VALUES, PRODUCT_DEMO_VALUES } from '@/constants/global';

export default function ProductCreatePage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    let demoValues: any = null;

    if(USE_DEMO_VALUES) {
      // valores demo para propositos de prueba
      demoValues = PRODUCT_DEMO_VALUES;
    }

    const handleSubmit = async (data: CreateProductPayload) => {
        console.log('Payload:', data);

        try {
            await createProduct(data);
            showToast('Producto creado exitosamente', 'success');
            navigate('/products');
        } catch (error) {
            console.error(error);
            showToast('Error al crear el producto', 'error');
        }
    };

    return (
        <>
            {/* Breadcrumbs */}
            <nav className="breadcrumbs text-sm mb-4" aria-label="Breadcrumb">
                <ul>
                    <li><Link to="/products">Productos</Link></li>
                    <li className="text-base-content/70">Crear</li>
                </ul>
            </nav>

            <h2 className="text-2xl font-bold mb-8">Crear Producto</h2>
            <ProductForm
                onSubmit={handleSubmit}
                submitLabel="Guardar"
                defaultValues={demoValues}
            />
        </>
    );
}
