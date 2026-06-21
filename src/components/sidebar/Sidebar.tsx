import { NavLink } from 'react-router-dom'
// import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <div className="w-72 bg-base-100 border-r border-base-300 flex flex-col">
      {/* Header del sidebar */}
      <div className="p-4 border-b border-base-300">
        <h2 className="font-bold text-lg">Formulario</h2>
        <p className="text-xs text-base-content/60">Green v3</p>
      </div>

      {/* Menú daisyUI */}
      <ul className="menu rounded-box w-full">
        <li className="menu-title">Modulos</li>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'menu-active' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Productos
          </NavLink>
        </li>
        <li>
          <NavLink to="/reportes" className={({ isActive }) => isActive ? 'menu-active' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Reportes
          </NavLink>
        </li>
      </ul>
    </div>
  )
}
