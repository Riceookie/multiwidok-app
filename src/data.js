// Konto GitHub, na które trafiają wszystkie repozytoria zadań.
export const OWNER = 'Riceookie'

// Mapowanie: repozytorium ↔ zadanie ze stażu.
// slug = nazwa repo na GitHubie (używana w URL: /repo/:slug oraz w zapytaniach do API).
export const repos = [
  { slug: 'multiwidok-app',        task: 'Wielostronicowa aplikacja (routing)', priority: 'high',   thisApp: true },
  { slug: 'biblioteczka',          task: 'Mini-aplikacja z bazą i relacją',     priority: 'medium' },
  { slug: 'formularz-rejestracji', task: 'Formularz z walidacją',               priority: 'medium' },
  { slug: 'arena-survivor',        task: 'Gierka',                              priority: 'medium' },
  { slug: 'todo-app',              task: 'Aplikacja To-Do z zapisem',           priority: 'medium' },
  { slug: 'users-app',             task: 'Pobieranie danych z publicznego API', priority: 'medium' },
  { slug: 'counter-app',           task: 'Drugie zadanie: licznik kliknięć',    priority: 'medium' },
  { slug: 'welcome-page',          task: 'Pierwsze zadanie: strona powitalna',  priority: 'medium' },
]

// Pomocnik: znajdź repo po slugu z URL (slug jest stringiem).
export function repoBySlug(slug) {
  return repos.find((r) => r.slug === slug)
}

// Zbuduj adres repozytorium na GitHubie (kod źródłowy).
export function repoUrl(slug) {
  return `https://github.com/${OWNER}/${slug}`
}

// Zbuduj adres działającej aplikacji (GitHub Pages — project site).
export function liveUrl(slug) {
  return `https://${OWNER.toLowerCase()}.github.io/${slug}/`
}
