import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
// import styles from './Sidebar.module.css'

export default function Sidebar() {
  const { logout } = useAuth() ?? {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout?.();
    navigate('/login');
  };

  return (
    <div className="w-72 bg-base-100 border-r border-base-300 flex flex-col">
      {/* Header del sidebar */}
      <div className="p-4 border-b border-base-300">
        <h2 className="font-bold text-lg">Dexa</h2>
        <p className="text-xs text-base-content/60">v1.0.0</p>
      </div>

      {/* Menú daisyUI */}
      <ul className="menu rounded-box w-full">
        <li className="menu-title">Modulos</li>
        <li>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'menu-active' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Productos
          </NavLink>
        </li>
        <li>
          <NavLink to="/movements" className={({ isActive }) => isActive ? 'menu-active' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            Movimientos de Inventario
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" className={({ isActive }) => isActive ? 'menu-active' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Usuarios
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/reportes" className={({ isActive }) => isActive ? 'menu-active' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Reportes
          </NavLink>
        </li> */}
      </ul>

      {/* Pie del sidebar con logout */}
      <div className="mt-auto p-4 border-t border-base-300">
        <button onClick={handleLogout} className="btn btn-ghost w-full justify-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
