import Link from "next/link";

export default function BasketNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony koszyka</h1>
      <p>Wygląda na to, że strona koszyka nie istnieje.</p>
  <p>Sprawdź ścieżkę lub wróć do <Link href="/basket">strony koszyka</Link>.</p>
    </main>
  );
}
