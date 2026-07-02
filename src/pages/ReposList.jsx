import { Link } from 'react-router-dom'
import { repos, repoUrl } from '../data.js'
import { useGithubRepos } from '../hooks/useGithubRepos.js'
import { timeAgo } from '../format.js'

// Widok listy: każde repo powiązane z zadaniem, z linkiem do szczegółów (routing po slugu)
// oraz przyciskiem otwierającym repo na GitHubie. Dane odświeżają się automatycznie.
export default function ReposList() {
  const { data, loading, error, lastUpdated, refresh } = useGithubRepos()

  return (
    <section>
      <div className="list-head">
        <div>
          <h1>Repozytoria zadań</h1>
          <p className="muted">
            Każda karta to repo powiązane z zadaniem. Widok odświeża się sam co 60 s —
            po każdym pushu zobaczysz nowy czas ostatniej zmiany.
          </p>
        </div>
        <div className="live">
          <span className="dot" /> na żywo
          <button className="refresh" onClick={refresh}>Odśwież</button>
        </div>
      </div>

      {error && <p className="banner error">⚠️ {error} Pokazuję ostatnie znane dane.</p>}
      {loading && !lastUpdated && <p className="muted">Ładowanie danych z GitHuba…</p>}

      <ul className="grid">
        {repos.map((r) => {
          const live = data[r.slug] // dane z API (mogą jeszcze nie dotrzeć)
          return (
            <li key={r.slug} className="card">
              <Link to={`/repo/${r.slug}`} className="card-link">
                <div className="tags">
                  <span className={`tag ${r.priority}`}>{r.priority}</span>
                  {r.thisApp && <span className="tag self">ta aplikacja</span>}
                </div>
                <h3>{r.slug}</h3>
                <p className="task">{r.task}</p>
                <p className="desc">{live ? (live.description || 'Brak opisu') : '…'}</p>
                <p className="meta">
                  {live?.language && <span className="lang">{live.language}</span>}
                  <span>↻ {live ? timeAgo(live.pushedAt) : '—'}</span>
                </p>
              </Link>
              {/* Przycisk otwiera repo w nowej karcie. */}
              <a className="btn open" href={repoUrl(r.slug)} target="_blank" rel="noreferrer">
                Otwórz repo ↗
              </a>
            </li>
          )
        })}
      </ul>

      {lastUpdated && (
        <p className="muted small">
          Ostatnia aktualizacja: {lastUpdated.toLocaleTimeString('pl-PL')}
        </p>
      )}
    </section>
  )
}
