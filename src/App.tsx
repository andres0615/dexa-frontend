import { Routes, Route, Navigate } from 'react-router-dom'
import LayoutAdmin from './components/layout/LayoutAdmin'
import { LayoutProvider } from './contexts/LayoutContext'
import { ToastProvider } from './components/toast/ToastContext'
import Toast from './components/toast/Toast'
import ProductListPage from './modules/products/pages/ProductListPage'
import ProductCreatePage from './modules/products/pages/ProductCreatePage'
import ProductEditPage from './modules/products/pages/ProductEditPage'
import MovementCreatePage from './modules/movements/pages/MovementCreatePage'
import MovementListPage from '@/modules/movements/pages/MovementListPage'
import MovementEditPage from './modules/movements/pages/MovementEditPage'
import UserListPage from '@/modules/users/pages/UserListPage'
import UserCreatePage from '@/modules/users/pages/UserCreatePage'
import UserEditPage from '@/modules/users/pages/UserEditPage'
import './App.css'
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/guards/AuthGuard';
import GuestGuard from '@/components/guards/GuestGuard';
import LoginPage from '@/modules/auth/pages/LoginPage';
import ThirdPartyListPage from '@/modules/third-party/pages/ThirdPartyListPage';
import ThirdPartyCreatePage from '@/modules/third-party/pages/ThirdPartyCreatePage';
import ThirdPartyEditPage from '@/modules/third-party/pages/ThirdPartyEditPage';

function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <ToastProvider>
          <Routes>
            {/* Rutas protegidas por auth */}
            <Route element={<AuthGuard />}>
              {/* Paginas con el layout de admin */}
              <Route element={<LayoutAdmin />}>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/create" element={<ProductCreatePage />} />
                <Route path="/products/:id/edit" element={<ProductEditPage />} />
                <Route path="/movements" element={<MovementListPage />} />
                <Route path="/movements/create" element={<MovementCreatePage />} />
                <Route path="/movements/:id/edit" element={<MovementEditPage />} />
                <Route path="/users" element={<UserListPage />} />
                <Route path="/users/create" element={<UserCreatePage />} />
                <Route path="/users/:id/edit" element={<UserEditPage />} />
                <Route path="/third-party" element={<ThirdPartyListPage />} />
                <Route path="/third-party/create" element={<ThirdPartyCreatePage />} />
                <Route path="/third-party/:id/edit" element={<ThirdPartyEditPage />} />
              </Route>
            </Route>

            {/* Rutas públicas */}
            <Route element={<GuestGuard />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Routes>
          {/* Componente que muestra los notificaciones en la esquina inferior derecha */}
          <Toast />
        </ToastProvider>
      </LayoutProvider>
    </AuthProvider>
  )
}

export default App
