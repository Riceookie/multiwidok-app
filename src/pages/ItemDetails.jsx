import { useParams, useNavigate, Link } from 'react-router-dom'
import { getItemById } from '../data.js'
import NotFound from './NotFound.jsx'

// Widok szczegółów: odczytuje :id z URL i wyszukuje element.
export default function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = getItemById(id)

  // Nieistniejące ID (np. /items/999) → pokazujemy widok 404.
  if (!item) return <NotFound />

  return (
    <section>
      <button className="back" onClick={() => navigate(-1)}>← Wstecz</button>
      <span className="tag">{item.category}</span>
      <h1>{item.name}</h1>
      <p className="price big">{item.price} zł</p>
      <p className="description">{item.description}</p>
      <p className="muted">ID produktu (z URL): <code>{id}</code></p>
      <p><Link to="/">← Powrót do listy</Link></p>
    </section>
  )
}
