import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { repoBySlug, repoUrl, OWNER } from '../data.js'
import { timeAgo } from '../format.js'
import NotFound from './NotFound.jsx'

// Widok szczegółów: odczytuje :slug z URL, pobiera dane repo oraz ostatni commit
// z GitHub API i odświeża je automatycznie co 60 s.
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
      <div className="tags">
        <span className={`tag ${meta.priority}`}>{meta.priority}</span>
        {meta.thisApp && <span className="tag self">ta aplikacja</span>}
      </div>
      <h1>{slug}</h1>
      <p className="task big">Zadanie: {meta.task}</p>

      {error && <p className="banner error">⚠️ {error}</p>}

      {info && (
        <>
          <p className="description">{info.description || 'Brak opisu repozytorium.'}</p>
          <ul className="facts">
            <li>Język: <strong>{info.language || '—'}</strong></li>
            <li>Gałąź: <strong>{info.default_branch}</strong></li>
            <li>Ostatni push: <strong>{timeAgo(info.pushed_at)}</strong></li>
            <li>⭐ <strong>{info.stargazers_count}</strong></li>
          </ul>
        </>
      )}

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

      <p>
        <a className="btn open" href={repoUrl(slug)} target="_blank" rel="noreferrer">
          Otwórz repo na GitHubie ↗
        </a>
      </p>
      <p className="muted small">
        Odświeża się automatycznie co 60 s. Slug z URL: <code>{slug}</code>
      </p>
      <p><Link to="/">← Powrót do listy</Link></p>
    </section>
  )
}
