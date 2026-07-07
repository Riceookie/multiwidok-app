// Konto GitHub, na które trafiają wszystkie repozytoria zadań.
export const OWNER = 'Riceookie'

// Mapowanie: repozytorium ↔ zadanie ze stażu.
// slug = nazwa repo na GitHubie (używana w URL: /repo/:slug oraz w zapytaniach do API).
// icon = emoji-znaczek kafelka. category = grupa do zakładek/filtra.
export const repos = [
  { slug: 'multiwidok-app',        task: 'Wielostronicowa aplikacja (routing)', priority: 'high',   thisApp: true, icon: '📦', category: 'Narzędzia' },
  { slug: 'isaacdex',              task: 'Aplikacja biznesowa (monorepo Turbo)', priority: 'high',  live: 'https://isaacdex.vercel.app/', icon: '🪽', category: 'Aplikacje' },
  { slug: 'czat-na-zywo',          task: 'Czat na żywo (WebSocket)',            priority: 'high',   live: 'https://czat-na-zywo.vercel.app/', icon: '💬', category: 'Aplikacje' },
  { slug: 'biblioteczka',          task: 'Mini-aplikacja z bazą i relacją',     priority: 'medium', live: 'https://biblioteczka-two.vercel.app/', icon: '📚', category: 'Aplikacje' },
  { slug: 'serialoteka',           task: 'Projekt końcowy: mini-aplikacja full-stack', priority: 'high', live: 'https://serialoteka.vercel.app/', icon: '🎬', category: 'Aplikacje' },
  { slug: 'crud-notatki',          task: 'CRUD z backendem',                    priority: 'high',   live: 'https://crud-notatki.vercel.app/', icon: '📝', category: 'Aplikacje' },
  { slug: 'logowanie-role',        task: 'Logowanie i role (MENTOR / STAŻYSTA)', priority: 'high',  live: 'https://logowanie-role.vercel.app/', icon: '🛡️', category: 'Aplikacje' },
  { slug: 'logowanie-sesja',       task: 'Logowanie i sesja',                   priority: 'high',   icon: '🔐', category: 'Aplikacje' },
  { slug: 'formularz-rejestracji', task: 'Formularz z walidacją',               priority: 'medium', icon: '📋', category: 'Narzędzia' },
  { slug: 'arena-survivor',        task: 'Gierka',                              priority: 'medium', icon: '🎮', category: 'Gry' },
  { slug: 'todo-app',              task: 'Aplikacja To-Do z zapisem',           priority: 'medium', icon: '✅', category: 'Aplikacje' },
  { slug: 'users-app',             task: 'Pobieranie danych z publicznego API', priority: 'medium', icon: '👥', category: 'Aplikacje' },
  { slug: 'counter-app',           task: 'Drugie zadanie: licznik kliknięć',    priority: 'medium', icon: '🔢', category: 'Narzędzia' },
  { slug: 'welcome-page',          task: 'Pierwsze zadanie: strona powitalna',  priority: 'medium', icon: '👋', category: 'Strony' },
]

// Kategorie do zakładek/filtra (kolejność = kolejność zakładek). Każda ma ikonę.
export const CATEGORIES = [
  { key: 'Gry',        icon: '🎮' },
  { key: 'Aplikacje',  icon: '📱' },
  { key: 'Narzędzia',  icon: '🛠️' },
  { key: 'Strony',     icon: '📄' },
]

export function categoryIcon(key) {
  return CATEGORIES.find((c) => c.key === key)?.icon || '🗂️'
}

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

// Adres działającego dema: własny URL z pola `live` (np. Vercel dla apek Next.js),
// a w razie braku — domyślny project site na GitHub Pages.
export function demoUrl(r) {
  return r.live || liveUrl(r.slug)
}
