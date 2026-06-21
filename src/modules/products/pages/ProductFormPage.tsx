import { Link } from 'react-router-dom';

export default function ProductFormPage() {
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
            <form>

                {/* Información General */}
                <div className="card bg-base-100 shadow-md mb-6">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Información General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="floating-label">
                                <span>Código / SKU</span>
                                <input type="text" placeholder="Código / SKU" className="input input-md w-full" required />
                            </label>
                            <label className="floating-label">
                                <span>Código de Barras</span>
                                <input type="text" placeholder="Código de Barras" className="input input-md w-full" />
                            </label>
                            <label className="floating-label">
                                <span>Nombre del Producto</span>
                                <input type="text" placeholder="Nombre del Producto" className="input input-md w-full" required />
                            </label>
                            <div className="md:col-span-3">
                                <label className="floating-label">
                                    <span>Descripción</span>
                                    <textarea className="textarea textarea-md w-full h-24" placeholder="Descripción"></textarea>
                                </label>
                            </div>
                            <label className="floating-label">
                                <select className="select select-md w-full" required>
                                    <option disabled selected>Seleccionar</option>
                                    <option>Electrónica</option>
                                    <option>Ropa</option>
                                    <option>Alimentos</option>
                                    <option>Hogar</option>
                                    <option>Deportes</option>
                                </select>
                                <span>Categoría</span>
                            </label>
                            <label className="floating-label">
                                <select className="select select-md w-full">
                                    <option disabled selected>Seleccionar</option>
                                    <option>Opción 1</option>
                                    <option>Opción 2</option>
                                    <option>Opción 3</option>
                                </select>
                                <span>Subcategoría</span>
                            </label>
                            <label className="floating-label">
                                <span>Marca</span>
                                <input type="text" placeholder="Marca" className="input input-md w-full" />
                            </label>
                            {/* <div className="md:col-span-3">
                                <label className="label text-xs mb-2 font-bold" htmlFor="imagen">Imagen del Producto</label>
                                <input type="file" id="imagen" className="file-input file-input-md file-input-primary w-full" />
                                <p className="label-text-alt text-base-content/60 mt-1 text-xs">JPG, PNG o WebP (máx. 5 MB)</p>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Unidad y Medidas */}
                <div className="card bg-base-100 shadow-md mb-6">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Unidad y Medidas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="floating-label">
                                <select className="select select-md w-full" required>
                                    <option disabled selected>Seleccionar</option>
                                    <option>UND — Unidad</option>
                                    <option>KG — Kilogramo</option>
                                    <option>LT — Litro</option>
                                    <option>MT — Metro</option>
                                    <option>CM — Centímetro</option>
                                    <option>CJA — Caja</option>
                                    <option>PAR — Par</option>
                                </select>
                                <span>Unidad de Medida</span>
                            </label>
                            <label className="floating-label">
                                <span>Presentación</span>
                                <input type="text" placeholder="Presentación" className="input input-md w-full" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Precios */}
                <div className="card bg-base-100 shadow-md mb-6">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Precios</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="floating-label">
                                <span>Precio de Costo</span>
                                <input type="number" placeholder="Precio de Costo" className="input input-md w-full" min="0" step="0.01" required />
                            </label>
                            <label className="floating-label">
                                <span>Precio de Venta</span>
                                <input type="number" placeholder="Precio de Venta" className="input input-md w-full" min="0" step="0.01" required />
                            </label>
                            <label className="floating-label">
                                <span>Precio Mayorista</span>
                                <input type="number" placeholder="Precio Mayorista" className="input input-md w-full" min="0" step="0.01" />
                            </label>
                            <div>
                                <span className="font-medium text-sm block">Aplica Impuesto</span>
                                <div className="flex items-center gap-3 h-10">
                                    <input type="checkbox" className="toggle toggle-primary" />
                                    <span className="text-sm font-light">No</span>
                                </div>
                            </div>
                            <label className="floating-label">
                                <span>% IVA</span>
                                <input type="number" placeholder="% IVA" className="input input-md w-full" min="0" step="0.01" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Control de Inventario */}
                <div className="card bg-base-100 shadow-md mb-6">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Control de Inventario</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="floating-label">
                                <span>Stock Inicial</span>
                                <input type="number" placeholder="Stock Inicial" className="input input-md w-full" min="0" required />
                            </label>
                            <label className="floating-label">
                                <span>Stock Mínimo</span>
                                <input type="number" placeholder="Stock Mínimo" className="input input-md w-full" min="0" required />
                            </label>
                            <label className="floating-label">
                                <span>Stock Máximo</span>
                                <input type="number" placeholder="Stock Máximo" className="input input-md w-full" min="0" />
                            </label>
                            <label className="floating-label">
                                <span>Ubicación en Bodega</span>
                                <input type="text" placeholder="Ubicación en Bodega" className="input input-md w-full" />
                            </label>
                            <label className="floating-label">
                                <select className="select select-md w-full">
                                    <option disabled selected>Seleccionar</option>
                                    <option>Proveedor A</option>
                                    <option>Proveedor B</option>
                                    <option>Proveedor C</option>
                                </select>
                                <span>Proveedor Principal</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Configuración */}
                <div className="card bg-base-100 shadow-md mb-10">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Configuración</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <span className="font-medium text-sm block">Vender sin Stock</span>
                                <div className="flex items-center gap-3 h-10">
                                    <input type="checkbox" className="toggle toggle-primary" />
                                    <span className="text-sm font-light">No</span>
                                </div>
                            </div>
                            <div>
                                <span className="font-medium text-sm block">Es un Servicio</span>
                                <div className="flex items-center gap-3 h-10">
                                    <input type="checkbox" className="toggle toggle-primary" />
                                    <span className="text-sm font-light">No</span>
                                </div>
                                <p className="label-text-alt text-base-content/60 text-xs">No descuenta inventario</p>
                            </div>
                            <label className="floating-label">
                                <select className="select select-md w-full" required>
                                    <option value="activo" selected>Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                                <span>Estado</span>
                            </label>
                            <div className="md:col-span-3">
                                <label className="floating-label">
                                    <span>Notas Internas</span>
                                    <textarea className="textarea textarea-md w-full h-24" placeholder="Notas Internas"></textarea>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-3">
                    <button type="submit" className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
                        </svg>
                        Guardar
                    </button>
                    <button type="reset" className="btn btn-soft">Cancelar</button>
                </div>
            </form>
        </>
    );
}
