import { useState, useEffect, useCallback, useRef } from 'react'
import { OWNER, repos as staticRepos } from '../data.js'

// GitHub API bez tokenu ma limit 60 zapytań/godz. na IP. Odpytywanie co 60 s
// (lista) + widok szczegółów potrafiło ten limit wyczerpać i wywalić 403.
// Dlatego: (1) odświeżamy rzadziej — co 5 min, (2) cache'ujemy wynik w
// localStorage, więc po odświeżeniu/limicie pokazujemy ostatnie znane dane
// zamiast błędu.
const POLL_MS = 5 * 60_000
const CACHE_KEY = 'ghrepos-cache-v1'
const knownSlugs = new Set(staticRepos.map((r) => r.slug))

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null // { data, at }
  } catch {
    return null
  }
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, at: Date.now() }))
  } catch {
    /* brak localStorage (np. tryb prywatny) — trudno, działamy bez cache */
  }
}

// Custom hook: pobiera z GitHub API stan repozytoriów i cyklicznie odświeża,
// z cache'em w localStorage i odpornością na limit zapytań (403).
export function useGithubRepos() {
  const cached = loadCache()
  const [data, setData] = useState(cached?.data ?? {}) // slug -> dane repo z API
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!cached)
  const [lastUpdated, setLastUpdated] = useState(cached?.at ? new Date(cached.at) : null)
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
            ? 'Przekroczono limit zapytań do GitHuba (60/godz. bez tokenu).'
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
      saveCache(map)
      setError(null)
      setLastUpdated(new Date())
    } catch (e) {
      // Nie kasujemy dotychczasowych danych — pokazujemy ostatnie znane (cache).
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRepos() // pierwsze pobranie od razu (odświeży cache, jeśli limit pozwoli)
    timer.current = setInterval(fetchRepos, POLL_MS) // potem co 5 min
    return () => clearInterval(timer.current) // sprzątamy interwał przy odmontowaniu
  }, [fetchRepos])

  return { data, loading, error, lastUpdated, refresh: fetchRepos }
}
