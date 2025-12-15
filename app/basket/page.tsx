/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SignIn, SignOut } from '@/components/auth-components';
import {
  getCartWithItems,
  getCartTotal,
  getAllUsersWithCarts,
  transferCart,
} from '@/lib/actions/cart';

// Server Action do obsługi transferu koszyka
async function transferCartAction(formData: FormData) {
  'use server';

  const fromUserId = formData.get('fromUserId')?.toString() ?? '';
  const toUserId = formData.get('toUserId')?.toString() ?? '';

  // Walidacja – nie przenosimy do tego samego użytkownika
  if (!fromUserId || !toUserId || fromUserId === toUserId) {
    return;
  }

  await transferCart(fromUserId, toUserId);
  redirect('/basket');
}

export default async function BasketPage() {
  const session = await auth();
  const loggedInUserId = (session?.user as any)?.id as string | undefined;
  const loggedInUserEmail = session?.user?.email ?? '';

  const [cart, total, usersWithCarts] = await Promise.all([
    loggedInUserId ? getCartWithItems(loggedInUserId) : Promise.resolve(null),
    loggedInUserId ? getCartTotal(loggedInUserId) : Promise.resolve(0),
    getAllUsersWithCarts(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* 1. Nagłówek + auth */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Koszyk</h1>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-600">
                Zalogowano jako{' '}
                <span className="font-medium">{loggedInUserEmail}</span>
              </span>
              <SignOut />
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                Nie jesteś zalogowany.
              </span>
              <SignIn provider="github" />
            </>
          )}
        </div>
      </header>

      {/* Info dla niezalogowanych */}
      {!session && (
        <p className="text-sm text-gray-700">
          Zaloguj się, aby zobaczyć swój koszyk i przenosić produkty między
          użytkownikami.
        </p>
      )}

      {/* 3. Widok koszyka tylko dla zalogowanego */}
      {session && (
        <>
          {/* 3a. Pusty koszyk */}
          {!cart || cart.items.length === 0 ? (
            <section>
              <p>Twój koszyk jest pusty.</p>
            </section>
          ) : (
            <>
              {/* 3b. Lista produktów w koszyku */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Produkty w koszyku</h2>
                <ul className="space-y-4">
                  {cart.items.map((item) => {
                    const price = Number(item.product.price);
                    const lineTotal = price * item.quantity;

                    return (
                      <li
                        key={item.id}
                        className="flex gap-4 rounded-lg border p-4"
                      >
                       
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <Image
                              src="/politechnika-krakowska-logo.svg"
                              alt={item.product.name}
                              fill
                              className="cover"
                            />
                          </div>
                      

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="font-semibold">
                              {item.product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Kategoria: {item.product.category.name}
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                            <span>Cena: {price.toFixed(2)} zł</span>
                            <span>Ilość: {item.quantity}</span>
                            <span className="font-semibold">
                              Razem: {lineTotal.toFixed(2)} zł
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* 3c + 3d. Podsumowanie + „Przejdź do kasy” */}
              <section className="flex flex-col items-end gap-4">
                <div className="rounded-lg border px-6 py-4 text-right">
                  <div className="text-sm text-gray-500">Suma całkowita</div>
                  <div className="text-xl font-bold">
                    {total.toFixed(2)} zł
                  </div>
                </div>
                <button className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white">
                  Przejdź do kasy
                </button>
              </section>
            </>
          )}

          {/* 4. Sekcja transferu koszyka */}
          <section className="mt-8 space-y-4 rounded-lg border p-4">
            <h2 className="text-lg font-semibold">
              Przenieś koszyk między użytkownikami
            </h2>

            {/* 4b. Lista użytkowników z liczbą produktów */}
            <ul className="text-sm text-gray-700">
              {usersWithCarts.map((user) => {
                const itemsCount = user.cart?.items.length ?? 0;
                return (
                  <li key={user.id}>
                    {user.email ?? '(bez e-maila)'} – {itemsCount} produkt
                    {itemsCount === 1
                      ? ''
                      : itemsCount >= 2 && itemsCount <= 4
                      ? 'y'
                      : 'ów'}{' '}
                    w koszyku
                  </li>
                );
              })}
            </ul>

            {/* 4a + 4d. Formularz transferu z walidacją */}
            <form
              action={transferCartAction}
              className="mt-4 flex flex-wrap items-end gap-4"
            >
              <div>
                <label className="block text-sm font-medium">
                  Od użytkownika
                </label>
                <select
                  name="fromUserId"
                  className="mt-1 rounded-md border px-3 py-2 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Wybierz użytkownika
                  </option>
                  {usersWithCarts.map((user) => {
                    const itemsCount = user.cart?.items.length ?? 0;
                    return (
                      <option key={user.id} value={user.id}>
                        {user.email ?? '(bez e-maila)'} — {itemsCount} prod.
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Do użytkownika
                </label>
                <select
                  name="toUserId"
                  className="mt-1 rounded-md border px-3 py-2 text-sm"
                  defaultValue={loggedInUserId ?? ''}
                >
                  <option value="" disabled>
                    Wybierz użytkownika
                  </option>
                  {usersWithCarts.map((user) => {
                    const itemsCount = user.cart?.items.length ?? 0;
                    return (
                      <option key={user.id} value={user.id}>
                        {user.email ?? '(bez e-maila)'} — {itemsCount} prod.
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                type="submit"
                className="rounded-md bg-neutral-700 px-4 py-2 text-sm font-medium text-white"
              >
                Przenieś koszyk
              </button>
            </form>

            <p className="text-xs text-gray-500">
              Uwaga: nie można przenieść koszyka do tego samego użytkownika –
              taka próba zostanie zignorowana.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
