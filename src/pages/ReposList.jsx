import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { repos, repoUrl, demoUrl } from '../data.js'
import { useGithubRepos } from '../hooks/useGithubRepos.js'
import { timeAgo } from '../format.js'

// Kolory kropek języka (jak na GitHubie) — czysto wizualny akcent.
const LANG_COLOR = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

// Deterministyczny odcień (0–359) z nazwy repo — kafelek podglądu ma stały kolor.
function hueOf(slug) {
  let h = 0
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) % 360
  return h
}

export default function ReposList() {
  const { data, loading, error, lastUpdated, refresh } = useGithubRepos()

  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState('all') // all | high | medium | low
  const [sort, setSort] = useState('default') // default | recent | name

  // Statystyki liczone z listy + danych na żywo (gdy są).
  const stats = useMemo(() => {
    const langs = new Set()
    let stars = 0
    for (const r of repos) {
      const live = data[r.slug]
      if (live?.language) langs.add(live.language)
      if (live?.stars) stars += live.stars
    }
    return {
      total: repos.length,
      high: repos.filter((r) => r.priority === 'high').length,
      medium: repos.filter((r) => r.priority === 'medium').length,
      langs: [...langs],
      stars,
    }
  }, [data])

  // Filtrowanie + sortowanie (pochodne stanu — useMemo, by nie liczyć bez potrzeby).
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = repos.filter((r) => {
      const okPriority = priority === 'all' || r.priority === priority
      const okQuery = !q || r.slug.toLowerCase().includes(q) || r.task.toLowerCase().includes(q)
      return okPriority && okQuery
    })
    if (sort === 'name') {
      list = [...list].sort((a, b) => a.slug.localeCompare(b.slug, 'pl'))
    } else if (sort === 'recent') {
      list = [...list].sort((a, b) => {
        const ta = data[a.slug]?.pushedAt ? Date.parse(data[a.slug].pushedAt) : 0
        const tb = data[b.slug]?.pushedAt ? Date.parse(data[b.slug].pushedAt) : 0
        return tb - ta
      })
    }
    return list
  }, [query, priority, sort, data])

  return (
    <section>
      <div className="hero">
        <h1>Repozytoria zadań</h1>
        <p className="muted">
          Każda karta to jedno zadanie. Kliknij <strong>Otwórz aplikację</strong>, żeby od razu
          uruchomić gotowy projekt. Dane odświeżają się same co 5&nbsp;min.
        </p>

        {/* Panel statystyk */}
        <div className="stats">
          <span className="stat"><b>{stats.total}</b> aplikacji</span>
          <span className="stat"><b>{stats.high}</b> high · <b>{stats.medium}</b> medium</span>
          {stats.langs.length > 0 && (
            <span className="stat">{stats.langs.join(' · ')}</span>
          )}
          <span className="stat">⭐ <b>{stats.stars}</b></span>
        </div>

        <div className="live">
          <span className="dot" /> na żywo
          <button className="refresh" onClick={refresh}>↻ Odśwież</button>
          {lastUpdated && (
            <span className="small">· aktualizacja {lastUpdated.toLocaleTimeString('pl-PL')}</span>
          )}
        </div>
      </div>

      {/* Kontrolki: szukaj / filtr priorytetu / sortowanie */}
      <div className="controls">
        <input
          className="search"
          type="search"
          placeholder="🔍 Szukaj po nazwie lub zadaniu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="all">Priorytet: wszystkie</option>
          <option value="high">Tylko high</option>
          <option value="medium">Tylko medium</option>
          <option value="low">Tylko low</option>
        </select>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Sortuj: domyślnie</option>
          <option value="recent">Najnowsze zmiany</option>
          <option value="name">Alfabetycznie</option>
        </select>
      </div>

      {error && Object.keys(data).length === 0 && (
        <p className="banner error">⚠️ {error} Karty działają, brak tylko danych na żywo.</p>
      )}
      {error && Object.keys(data).length > 0 && (
        <p className="muted small">Dane mogą być nieco starsze (limit GitHub API) — pokazuję ostatnie znane.</p>
      )}
      {loading && !lastUpdated && <p className="muted">Ładowanie danych z GitHuba…</p>}

      {visible.length === 0 ? (
        <p className="muted">Brak zadań pasujących do filtrów.</p>
      ) : (
        <ul className="grid">
          {visible.map((r) => {
            const live = data[r.slug]
            const hue = hueOf(r.slug)
            return (
              <li key={r.slug} className="card">
                {/* Żywy podgląd aplikacji (iframe), a pod nim kafelek z ikoną jako
                    fallback — widać go w trakcie ładowania i gdy apka jest ciemna,
                    więc karta nigdy nie jest „czarną dziurą”. */}
                <Link
                  to={`/repo/${r.slug}`}
                  className="thumb"
                  aria-label={`Szczegóły: ${r.slug}`}
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue} 55% 24%), hsl(${(hue + 40) % 360} 60% 15%))`,
                  }}
                >
                  <span className="thumb-fallback">{r.icon || '🗂️'}</span>
                  <iframe
                    className="thumb-frame"
                    src={demoUrl(r)}
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
                  <a className="btn open" href={demoUrl(r)} target="_blank" rel="noreferrer">
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
      )}
    </section>
  )
}
