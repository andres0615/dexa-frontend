import { Routes, Route, Navigate } from 'react-router-dom'
import LayoutAdmin from './components/layout/LayoutAdmin'
import { LayoutProvider } from './contexts/LayoutContext'
import { ToastProvider } from './components/toast/ToastContext'
import Toast from './components/toast/Toast'
import ProductListPage from './modules/products/pages/ProductListPage'
import ProductFormPage from './modules/products/pages/ProductFormPage'
import './App.css'

function App() {
  return (
    <LayoutProvider>
      <ToastProvider>
        <LayoutAdmin>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/create" element={<ProductFormPage />} />
          </Routes>
        </LayoutAdmin>
        {/* Componente que muestra los notificaciones en la esquina inferior derecha */}
        <Toast />
      </ToastProvider>
    </LayoutProvider>
  )
}

export default App
