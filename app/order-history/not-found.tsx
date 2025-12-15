import Link from "next/link";

export default function OrderHistoryNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony historii zakupów</h1>
      <p>Wygląda na to, że ta podstrona nie istnieje.</p>
  <p>Sprawdź ścieżkę lub wróć do <Link href="/order-history">strony historii zakupów</Link>.</p>
    </main>
  );
}
