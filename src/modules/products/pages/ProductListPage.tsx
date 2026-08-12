import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLayoutContext } from '../../../contexts/LayoutContext';
import type { Product, ProductFilters } from '../../../types/product';
import type { PaginationMeta } from '@/types/pagination';
import { fetchProductsPaginated, deleteProduct } from '../../../services/productService';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import { useToast } from '../../../components/toast/ToastContext';
import TablePagination from '@/components/ui/TablePagination';
import { fetchProductStatus } from '../../../services/productStatusService';
import { fetchProductCategories } from '../../../services/productCategoryService';
import type { ProductStatus } from '../../../types/product-status';
import type { ProductCategory } from '../../../types/product-category';
import { ucfirst, sleep } from '../../../utils/utils';
import ProductStatusBadge from '../components/ProductStatusBadge';
import CategoryLabel from '../components/CategoryLabel';

export default function ProductListPage() {
  const { setMaxWidth } = useLayoutContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);
  const { showToast } = useToast();
  const [productStatuses, setProductStatuses] = useState<ProductStatus[]>([])
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
  const [filters, setFilters] = useState<ProductFilters>({ name: '', status_id: null });
  const [loadingProducts, setLoadingProducts] = useState(false)
  const loadingProductsTimeout: number = 1000;
  const [countFilters, setCountFilters] = useState(0)

  // Click en el botón de eliminar
  function handleDeleteClick(product: Product): void {
    setProductToDelete(product);
    deleteDialogRef.current?.showModal();
  }

  // Cambiar de página en la paginación
  function handlePageChange(page: number): void {
    setCurrentPage(page);
  }

  useEffect(() => {
    setMaxWidth('max-w-[61rem]');
    return () => setMaxWidth('max-w-4xl');
  }, [setMaxWidth]);

  // Cargar productos
  useEffect(() => {
    // startLoadingProducts()
    setLoadingProducts(true)
    fetchProductsPaginated(currentPage, 10, filters)
      .then((result) => {
        setProducts(result.data);
        setPagination(result.pagination);
        // return result; // pasa al siguiente then
      })
      // .then(() => sleep(loadingProductsTimeout)) // espera 1s después del fetch
      .catch((err) => setError(err.message))
      .finally(() => setLoadingProducts(false));
  }, [currentPage]);

  // Obtener lista de status de producto
  useEffect(() => {
    fetchProductStatus()
      .then((result) => {
        setProductStatuses(result);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  // Obtener categorias de producto
  useEffect(() => {
    fetchProductCategories()
      .then((result) => {
        setProductCategories(result);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Records para demo
  const productRowsDemo = (
    <>
      <tr>
        <th>
          <label>
            <input type="checkbox" className="checkbox" />
          </label>
        </th>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar avatar-placeholder">
              <div className="bg-secondary text-secondary-content w-12 rounded-full">
                <span>C2</span>
              </div>
            </div>
            <div>
              <div className="font-bold">Camiseta Algodón Premium</div>
              <div className="text-sm opacity-50">SKU: CAM-002</div>
            </div>
          </div>
        </td>
        <td>Ropa</td>
        <td>$24.99</td>
        <td>
          <div className="flex items-center gap-2">
            <span>128</span>
            <progress className="progress progress-success w-16" value="80" max="100"></progress>
          </div>
        </td>
        <td><span className="badge badge-success badge-sm">Activo</span></td>
        <td>
          <div className="flex items-center gap-1">

            {/* Editar */}
            <div className="tooltip" data-tip="Editar">
              <button className="btn btn-ghost btn-sm btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                  className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
            </div>

            {/* Eliminar */}
            <div className="tooltip" data-tip="Eliminar">
              <button className="btn btn-ghost btn-sm btn-square text-error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                  stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>

          </div>
        </td>
      </tr>
      <tr>
        <th>
          <label>
            <input type="checkbox" className="checkbox" />
          </label>
        </th>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar avatar-placeholder">
              <div className="bg-accent text-accent-content w-12 rounded-full">
                <span>L3</span>
              </div>
            </div>
            <div>
              <div className="font-bold">Lámpara LED Inteligente</div>
              <div className="text-sm opacity-50">SKU: LAM-003</div>
            </div>
          </div>
        </td>
        <td>Hogar</td>
        <td>$49.99</td>
        <td>
          <div className="flex items-center gap-2">
            <span>0</span>
            <progress className="progress progress-error w-16" value="0" max="100"></progress>
          </div>
        </td>
        <td><span className="badge badge-error badge-sm">Agotado</span></td>
        <td>
          <div className="flex items-center gap-1">

            {/* Editar */}
            <div className="tooltip" data-tip="Editar">
              <button className="btn btn-ghost btn-sm btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                  className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
            </div>

            {/* Eliminar */}
            <div className="tooltip" data-tip="Eliminar">
              <button className="btn btn-ghost btn-sm btn-square text-error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                  stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>

          </div>
        </td>
      </tr>
    </>
  );

  // Cuando el usuario confirma la eliminacion
  async function handleConfirmDelete(): Promise<void> {
    // Si no hay un producto para eliminar, salir
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      // Remover el producto eliminado de la lista local sin recargar del backend
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      showToast('Producto eliminado exitosamente', 'success');
    } catch (err) {
      console.error(err);
      showToast(err as string, 'error');
    } finally {
      // Cerrar el modal limpiando el producto seleccionado
      setProductToDelete(null);
    }
  }

  function handleFilter(): void {
    setCurrentPage(1)
    setLoadingProducts(true)

    // Contar filtros activos
    const count = Object.values(filters).filter(value => value !== null && value !== '').length;
    setCountFilters(count);

    // Implementar lógica de filtrado
    fetchProductsPaginated(1, 10, filters)
      .then((result) => {
        setProducts(result.data);
        setPagination(result.pagination);
      })
      .then(() => sleep(loadingProductsTimeout)) // espera 1s después del fetch
      .catch((err) => setError(err.message))
      .finally(() => setLoadingProducts(false));
  }

  // Select para status de productos
  const productStatusSelect = (
    <select className="select select-md w-full" 
    value={filters.status_id ?? ''} 
    onChange={(e) => setFilters(prev => ({ ...prev, status_id: e.target.value ? Number(e.target.value) : null }))} >
      <option value="">Seleccionar</option>
      {productStatuses.map((status) => (
        <option key={status.id} value={status.id}>
          {ucfirst(status.name)}
        </option>
      ))}
    </select>
  );

  // Select para categoría de productos
  const productCategorySelect = (
    <select className="select select-md w-full"
    value={filters.category_id ?? ''}
    onChange={(e) => setFilters(prev => ({ ...prev, category_id: e.target.value ? Number(e.target.value) : null }))} >
      <option value="">Seleccionar</option>
      {productCategories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Productos</h2>
        <Link to="/products/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Añadir Producto
        </Link>
      </div>

      {/* Stats */}
      <div className="stats shadow bg-base-100 w-full mb-6 stats-vertical lg:stats-horizontal">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="stat-title">Total Productos</div>
          <div className="stat-value text-primary">248</div>
          <div className="stat-desc">12 más que el mes pasado</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Activos</div>
          <div className="stat-value text-success">198</div>
          <div className="stat-desc">79.8% del total</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-error">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="stat-title">Agotados</div>
          <div className="stat-value text-error">23</div>
          <div className="stat-desc">9.3% necesita reposición</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-title">Valor en Stock</div>
          <div className="stat-value text-info">$47,890</div>
          <div className="stat-desc">+5.2% vs mes anterior</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="flex flex-col lg:flex-row gap-2 w-full items-end">
            {/* Filtro nombre */}
            <div className="grow w-full lg:w-auto">
              <label className="floating-label w-full">
                <span>Buscar producto</span>
                <label className="input input-md w-full">
                  <svg className="h-5 w-5 opacity-60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Buscar producto..." 
                    className="grow" 
                    value={filters.name ?? ''} 
                    onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))} 
                  />
                </label>
              </label>
            </div>
            {/* Filtro categoría */}
            <label className="floating-label w-full lg:w-auto min-w-[200px]">
              <span>Categoría</span>
              { productCategorySelect }
            </label>
            {/* Filtro estado */}
            <label className="floating-label w-full lg:w-auto min-w-[200px]">
              <span>Estado</span>
                {productStatusSelect}
            </label>
            <div className="indicator w-full lg:w-auto">
              {countFilters > 0 && (
                <span className="indicator-item badge badge-primary badge-sm">{countFilters}</span>
              )}
              <button className="btn btn-soft btn-md w-full" onClick={handleFilter}>Filtrar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {loadingProducts ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <span className="loading loading-ring loading-lg text-primary"></span>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-base-content/60">
                      No hay productos
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const stockRatio = product.maximum_stock
                      ? Math.min((product.initial_stock / product.maximum_stock) * 100, 100)
                      : Math.min(product.initial_stock, 100);
                    const isOutOfStock = product.initial_stock === 0;
                    const isLowStock = product.initial_stock <= product.minimum_stock && !isOutOfStock;
                    const progressColor = isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success';
                    const statusLabel = isOutOfStock ? 'Agotado' : isLowStock ? 'Stock Bajo' : 'Activo';
                    const statusColor = isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success';

                    return (
                      <tr key={product.id}>
                        <th>
                          <label>
                            <input type="checkbox" className="checkbox" />
                          </label>
                        </th>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar avatar-placeholder">
                              <div className="bg-primary text-primary-content w-12 rounded-full">
                                <span>{product.name.charAt(0).toUpperCase()}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{product.name}</div>
                              <div className="text-sm opacity-50">SKU: {product.code}</div>
                            </div>
                          </div>
                        </td>
                        {/* Categoria */}
                        <td>
                          <CategoryLabel 
                            categoryId={product.category_id} 
                            categories={productCategories} 
                          />
                        </td>
                        <td>${Number(product.sale_price).toFixed(2)}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span>{product.initial_stock}</span>
                            <progress className={`progress progress-${progressColor} w-16`} value={stockRatio} max="100" />
                          </div>
                        </td>
                        <td>
                          {/* <span className={`badge badge-${statusColor} badge-sm`}>{statusLabel}</span> */}
                          <ProductStatusBadge product={product} statuses={productStatuses} />
                        </td>
                        <td>
                          <div className="flex items-center gap-1">

                            {/* Editar */}
                            <div className="tooltip" data-tip="Editar">
                              <Link to={`/products/${product.id}/edit`} className="btn btn-ghost btn-sm btn-square">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                                  className="size-5">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                              </Link>
                            </div>

                            {/* Eliminar */}
                            <div className="tooltip" data-tip="Eliminar">
                              <button
                                className="btn btn-ghost btn-sm btn-square text-error"
                                onClick={() => handleDeleteClick(product)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                  stroke="currentColor" className="size-5">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                            </div>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}

                {/* Productos para demo */}
                {/* {productRowsDemo} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      <TablePagination
        currentPage={currentPage}
        lastPage={pagination?.lastPage ?? 1}
        total={pagination?.total ?? 0}
        from={pagination?.from ?? null}
        to={pagination?.to ?? null}
        onPageChange={handlePageChange}
      />

      <ConfirmDeleteModal
        dialogRef={deleteDialogRef}
        name={productToDelete?.name ?? null}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
