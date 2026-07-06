import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { repoBySlug, repoUrl, demoUrl, OWNER } from '../data.js'
import { timeAgo } from '../format.js'
import NotFound from './NotFound.jsx'

// Widok szczegółów: odczytuje :slug z URL, pobiera dane repo oraz ostatni commit
// z GitHub API i odświeża je automatycznie co 60 s. Pokazuje też żywy podgląd aplikacji.
export default function RepoDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const meta = repoBySlug(slug)

  const [info, setInfo] = useState(null)
  const [commit, setCommit] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!meta) return // nieznany slug → nie pobieramy (i tak pokażemy 404)
    let alive = true

    async function load() {
      try {
        const [rRes, cRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${OWNER}/${slug}`),
          fetch(`https://api.github.com/repos/${OWNER}/${slug}/commits?per_page=1`),
        ])
        if (!rRes.ok) throw new Error(`Błąd GitHub API: ${rRes.status}`)
        const repo = await rRes.json()
        const commits = cRes.ok ? await cRes.json() : []
        if (!alive) return
        setInfo(repo)
        setCommit(Array.isArray(commits) ? commits[0] : null)
        setError(null)
      } catch (e) {
        if (alive) setError(e.message)
      }
    }

    load()
    const t = setInterval(load, 60_000)
    return () => { alive = false; clearInterval(t) }
  }, [slug, meta])

  // Nieistniejący slug (np. /repo/cokolwiek) → widok 404.
  if (!meta) return <NotFound />

  return (
    <section>
      <button className="back" onClick={() => navigate(-1)}>← Wstecz</button>

      <div className="detail-head">
        <div>
          <div className="tags">
            <span className={`tag ${meta.priority}`}>{meta.priority}</span>
            {meta.thisApp && <span className="tag self">ta aplikacja</span>}
          </div>
          <h1>{slug}</h1>
          <p className="task big">Zadanie: {meta.task}</p>
        </div>
        <a className="btn open big" href={demoUrl(meta)} target="_blank" rel="noreferrer">
          🚀 Otwórz aplikację
        </a>
      </div>

      {error && <p className="banner error">⚠️ {error}</p>}

      {info && (
        <ul className="facts">
          <li>Język: <strong>{info.language || '—'}</strong></li>
          <li>Gałąź: <strong>{info.default_branch}</strong></li>
          <li>Ostatni push: <strong>{timeAgo(info.pushed_at)}</strong></li>
          <li>⭐ <strong>{info.stargazers_count}</strong></li>
        </ul>
      )}

      {info?.description && <p className="description">{info.description}</p>}

      {/* Żywy podgląd działającej aplikacji (deployment na GitHub Pages). */}
      <div className="preview">
        <div className="preview-bar">
          <span className="dots"><i /><i /><i /></span>
          <span className="url">{demoUrl(meta)}</span>
        </div>
        <iframe src={demoUrl(meta)} title={`Podgląd aplikacji ${slug}`} loading="lazy" />
      </div>

      {commit && (
        <div className="commit">
          <h3>Ostatni commit</h3>
          <p className="commit-msg">{commit.commit.message.split('\n')[0]}</p>
          <p className="muted small">
            {commit.commit.author?.name} · {timeAgo(commit.commit.author?.date)} ·{' '}
            <code>{commit.sha.slice(0, 7)}</code>
          </p>
        </div>
      )}

      <p className="row">
        <a className="btn ghost" href={repoUrl(slug)} target="_blank" rel="noreferrer">
          ‹› Zobacz kod na GitHubie
        </a>
        <Link className="btn ghost" to="/">← Powrót do listy</Link>
      </p>
      <p className="muted small">
        Odświeża się automatycznie co 60 s. Slug z URL: <code>{slug}</code>
      </p>
    </section>
  )
}
