import { Link } from 'react-router-dom'
import { repos, repoUrl, liveUrl } from '../data.js'
import { useGithubRepos } from '../hooks/useGithubRepos.js'
import { timeAgo } from '../format.js'

// Kolory kropek języka (jak na GitHubie) — czysto wizualny akcent.
const LANG_COLOR = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

// Widok listy: każde repo powiązane z zadaniem, z linkiem do szczegółów (routing po slugu),
// dużym przyciskiem otwierającym DZIAŁAJĄCĄ aplikację i drobnym linkiem do kodu.
export default function ReposList() {
  const { data, loading, error, lastUpdated, refresh } = useGithubRepos()

  return (
    <section>
      <div className="hero">
        <h1>Repozytoria zadań</h1>
        <p className="muted">
          Każda karta to jedno zadanie. Kliknij <strong>Otwórz aplikację</strong>, żeby od razu
          uruchomić gotowy projekt. Dane odświeżają się same co 60&nbsp;s.
        </p>
        <div className="live">
          <span className="dot" /> na żywo
          <button className="refresh" onClick={refresh}>↻ Odśwież</button>
          {lastUpdated && (
            <span className="small">· aktualizacja {lastUpdated.toLocaleTimeString('pl-PL')}</span>
          )}
        </div>
      </div>

      {error && <p className="banner error">⚠️ {error} Pokazuję ostatnie znane dane.</p>}
      {loading && !lastUpdated && <p className="muted">Ładowanie danych z GitHuba…</p>}

      <ul className="grid">
        {repos.map((r) => {
          const live = data[r.slug] // dane z API (mogą jeszcze nie dotrzeć)
          return (
            <li key={r.slug} className="card">
              {/* Miniatura działającej aplikacji — od razu widać, co to jest. */}
              <Link to={`/repo/${r.slug}`} className="thumb" aria-label={`Szczegóły: ${r.slug}`}>
                <iframe
                  src={liveUrl(r.slug)}
                  title={`Podgląd ${r.slug}`}
                  loading="lazy"
                  tabIndex={-1}
                  scrolling="no"
                />
                <span className="thumb-veil" />
              </Link>

              <div className="card-body">
                <div className="tags">
                  <span className={`tag ${r.priority}`}>{r.priority}</span>
                  {r.thisApp && <span className="tag self">ta aplikacja</span>}
                </div>
                <Link to={`/repo/${r.slug}`} className="card-title">{r.slug}</Link>
                <p className="task">{r.task}</p>
                <p className="meta">
                  {live?.language && (
                    <span className="lang">
                      <i className="ldot" style={{ background: LANG_COLOR[live.language] || '#8b949e' }} />
                      {live.language}
                    </span>
                  )}
                  <span>↻ {live ? timeAgo(live.pushedAt) : '—'}</span>
                </p>
              </div>

              <div className="actions">
                <a className="btn open" href={liveUrl(r.slug)} target="_blank" rel="noreferrer">
                  🚀 Otwórz aplikację
                </a>
                <a className="btn ghost" href={repoUrl(r.slug)} target="_blank" rel="noreferrer">
                  ‹› Kod
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
