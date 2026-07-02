# Aplikacja z routingiem (React Router)

Aplikacja z wieloma widokami i nawigacją, zbudowana w React + Vite + React Router.

## Widoki
- **Lista produktów** (`/`) — siatka elementów z danych statycznych
- **Szczegóły** (`/items/:id`) — dane ładowane po ID z adresu URL, np. `/items/3`
- **404** (`*`) — każda nieistniejąca trasa lub nieznane ID produktu

## Cechy
- Routing przez React Router (`HashRouter` — działa na GitHub Pages bez konfiguracji serwera)
- Powiązanie szczegółów z ID w URL (`useParams`)
- Działające przyciski wstecz/naprzód przeglądarki
- Wspólny układ (nagłówek + nawigacja + stopka) na każdej stronie

## Uruchomienie lokalne
```bash
npm install
npm run dev      # tryb deweloperski
npm run build    # produkcyjny build do ./dist
npm run preview  # podgląd builda
```

## Publikacja
Build (`dist/`) wypychany na gałąź `gh-pages` i serwowany przez GitHub Pages.
Adres URL trasy używa `#`, np. `.../multiwidok-app/#/items/3`.
