// Statyczne dane (tablica). Każdy element ma unikalne ID używane w URL: /items/:id
export const items = [
  { id: 1, name: 'Klawiatura mechaniczna', category: 'Peryferia', price: 349, description: 'Klawiatura z przełącznikami brązowymi, podświetlenie RGB i wymienne keycapy.' },
  { id: 2, name: 'Myszka bezprzewodowa', category: 'Peryferia', price: 199, description: 'Lekka myszka 2.4 GHz z sensorem 16000 DPI i czasem pracy do 70 godzin.' },
  { id: 3, name: 'Monitor 27" QHD', category: 'Monitory', price: 1099, description: 'Panel IPS 2560×1440, 165 Hz, 1 ms, obsługa HDR i FreeSync.' },
  { id: 4, name: 'Słuchawki nauszne', category: 'Audio', price: 449, description: 'Słuchawki z aktywną redukcją szumów (ANC) i mikrofonem odłączanym.' },
  { id: 5, name: 'Dysk SSD 1 TB', category: 'Pamięć', price: 329, description: 'Dysk NVMe PCIe 4.0 o prędkości odczytu do 7000 MB/s.' },
  { id: 6, name: 'Kamera internetowa 1080p', category: 'Peryferia', price: 259, description: 'Kamera Full HD 60 fps z autofokusem i korekcją światła.' },
  { id: 7, name: 'Podkładka pod mysz XL', category: 'Akcesoria', price: 79, description: 'Duża podkładka 900×400 mm z antypoślizgowym spodem.' },
  { id: 8, name: 'Hub USB-C 7w1', category: 'Akcesoria', price: 189, description: 'Stacja z HDMI 4K, czytnikiem kart, USB 3.0 i zasilaniem 100 W.' },
]

// Pomocnik: znajdź element po ID (id z URL jest stringiem).
export function getItemById(id) {
  return items.find((it) => String(it.id) === String(id))
}
