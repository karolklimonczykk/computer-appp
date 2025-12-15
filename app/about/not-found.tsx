import Link from "next/link";

export default function AboutNotFound() {
  return (
    <main className="not-found">
      <h1>Nie znaleziono strony o sklepie</h1>
      <p>Wygląda na to, że ta podstrona nie istnieje.</p>
  <p>Sprawdź ścieżkę lub wróć do <Link href="/about">strony o sklepie</Link>.</p>
    </main>
  );
}
