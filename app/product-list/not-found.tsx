import Link from "next/link";

export default function ProductListNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony produktów</h1>
      <p>Wygląda na to, że strona z listą produktów nie istnieje.</p>
  <p>Sprawdź ścieżkę lub wróć do <Link href="/product-list">strony produktów</Link>.</p>
    </main>
  );
}
