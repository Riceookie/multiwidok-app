import { Routes, Route, Link, NavLink } from 'react-router-dom'
import ItemsList from './pages/ItemsList.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import NotFound from './pages/NotFound.jsx'

// Wspólny układ: nagłówek + nawigacja na każdej stronie (Outlet zastąpiony przez children).
function Layout({ children }) {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="brand">🛒 Katalog</Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Produkty
          </NavLink>
          <NavLink to="/items/999" className={({ isActive }) => (isActive ? 'active' : '')}>
            Przykład 404
          </NavLink>
        </nav>
      </header>
      <main className="content">{children}</main>
      <footer className="footer">Zadanie: aplikacja z routingiem (React Router)</footer>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Widok 1: lista elementów */}
        <Route path="/" element={<ItemsList />} />
        {/* Widok 2: szczegóły po ID z URL, np. /items/42 */}
        <Route path="/items/:id" element={<ItemDetails />} />
        {/* Widok 3: 404 dla każdej nieistniejącej trasy */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
