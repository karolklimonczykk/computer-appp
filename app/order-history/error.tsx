"use client";

import Link from "next/link";
import React from "react";

export default function OrderHistoryError({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <main className="not-found">
      <h1>Wystąpił błąd na stronie historii zakupów</h1>
      <p className="muted">{error?.message ?? "Nieznany błąd"}</p>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={() => reset()}>Spróbuj ponownie</button>
        <Link href="/">Strona główna</Link>
      </div>
    </main>
  );
}
