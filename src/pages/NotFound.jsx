import { Link } from 'react-router-dom'

// Widok 404 dla nieistniejących tras lub nieznanych ID.
export default function NotFound() {
  return (
    <section className="notfound">
      <h1>404</h1>
      <p>Nie znaleziono takiej strony ani produktu.</p>
      <Link to="/" className="btn">← Wróć do listy produktów</Link>
    </section>
  )
}
