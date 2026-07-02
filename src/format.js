// Zamienia datę ISO na czytelny względny czas po polsku, np. „3 min temu".
export function timeAgo(iso) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const sec = Math.round(diff / 1000)
  if (sec < 60) return 'przed chwilą'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} min temu`
  const godz = Math.round(min / 60)
  if (godz < 24) return `${godz} godz. temu`
  const dni = Math.round(godz / 24)
  if (dni < 30) return `${dni} dni temu`
  return new Date(iso).toLocaleDateString('pl-PL')
}
