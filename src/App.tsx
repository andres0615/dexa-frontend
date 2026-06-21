import { Routes, Route } from 'react-router-dom'
import LayoutAdmin from './components/layout/LayoutAdmin'
import { LayoutProvider } from './contexts/LayoutContext'
import ProductListPage from './modules/products/pages/ProductListPage'
import ProductFormPage from './modules/products/pages/ProductFormPage'
import './App.css'

function App() {
  return (
    <LayoutProvider>
      <LayoutAdmin>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/create" element={<ProductFormPage />} />
        </Routes>
      </LayoutAdmin>
    </LayoutProvider>
  )
}

export default App
