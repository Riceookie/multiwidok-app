import { useState, useEffect, useCallback, useRef } from 'react'
import { OWNER, repos as staticRepos } from '../data.js'

// Odpytujemy GitHub co 60 s. Bez tokenu limit API wynosi 60 zapytań/godz. na IP,
// a jedno zapytanie zwraca stan WSZYSTKICH repo, więc 60 s mieści się w limicie.
const POLL_MS = 60_000
const knownSlugs = new Set(staticRepos.map((r) => r.slug))

// Custom hook: pobiera z GitHub API listę repozytoriów użytkownika i cyklicznie ją
// odświeża. Dzięki temu widok sam się aktualizuje po każdej zmianie (push) w repo.
export function useGithubRepos() {
  const [data, setData] = useState({}) // slug -> dane repo z API
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const timer = useRef(null)

  const fetchRepos = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${OWNER}/repos?per_page=100&sort=pushed`,
        { headers: { Accept: 'application/vnd.github+json' } }
      )
      if (!res.ok) {
        throw new Error(
          res.status === 403
            ? 'Przekroczono limit zapytań do GitHuba — spróbuj za chwilę.'
            : `Błąd GitHub API: ${res.status}`
        )
      }
      const list = await res.json()
      const map = {}
      for (const r of list) {
        // Bierzemy tylko repozytoria powiązane z naszymi zadaniami.
        if (knownSlugs.has(r.name)) {
          map[r.name] = {
            pushedAt: r.pushed_at,
            updatedAt: r.updated_at,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            htmlUrl: r.html_url,
            defaultBranch: r.default_branch,
          }
        }
      }
      setData(map)
      setError(null)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRepos() // pierwsze pobranie od razu
    timer.current = setInterval(fetchRepos, POLL_MS) // potem cyklicznie
    return () => clearInterval(timer.current) // sprzątamy interwał przy odmontowaniu
  }, [fetchRepos])

  return { data, loading, error, lastUpdated, refresh: fetchRepos }
}
