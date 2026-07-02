import { Link } from 'react-router-dom'
import { items } from '../data.js'

// Widok listy: każdy element linkuje do szczegółów przez ID w URL.
export default function ItemsList() {
  return (
    <section>
      <h1>Produkty</h1>
      <p className="muted">Kliknij produkt, aby zobaczyć szczegóły (ID trafia do adresu URL).</p>
      <ul className="grid">
        {items.map((item) => (
          <li key={item.id} className="card">
            <Link to={`/items/${item.id}`} className="card-link">
              <span className="tag">{item.category}</span>
              <h3>{item.name}</h3>
              <p className="price">{item.price} zł</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
