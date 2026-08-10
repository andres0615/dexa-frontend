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
import LoginPage from '@/modules/auth/pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <LayoutProvider>
        <ToastProvider>
          <Routes>
            {/* Paginas con el layout de admin */}
            {/* <Route element={<AuthGuard />}> */}
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

                {/* Rutas protegidas por auth */}
                <Route element={<AuthGuard />}>
                  {/* <Route path="/users" element={<UserListPage />} /> */}
                </Route>
              </Route>
            {/* </Route> */}

            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          {/* Componente que muestra los notificaciones en la esquina inferior derecha */}
          <Toast />
        </ToastProvider>
      </LayoutProvider>
    </AuthProvider>
  )
}

export default App
