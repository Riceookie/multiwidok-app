import { Routes, Route, Link, NavLink } from 'react-router-dom'
import ReposList from './pages/ReposList.jsx'
import RepoDetails from './pages/RepoDetails.jsx'
import NotFound from './pages/NotFound.jsx'

// Wspólny układ: nagłówek + nawigacja na każdej stronie (Outlet zastąpiony przez children).
function Layout({ children }) {
  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="brand">📦 Repozytoria zadań</Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Repozytoria
          </NavLink>
        </nav>
      </header>
      <main className="content">{children}</main>
      <footer className="footer">
        Zadanie: wielostronicowa aplikacja z routingiem (React Router) · dane na żywo z GitHub API
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Widok 1: lista repozytoriów powiązanych z zadaniami */}
        <Route path="/" element={<ReposList />} />
        {/* Widok 2: szczegóły repo po slugu z URL, np. /repo/todo-app */}
        <Route path="/repo/:slug" element={<RepoDetails />} />
        {/* Widok 3: 404 dla każdej nieistniejącej trasy */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
