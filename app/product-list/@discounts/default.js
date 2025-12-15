import React from "react";
import Link from "next/link";
import { getAllAlphabetical } from "../../../lib/products";

export default function DiscountsDefault() {
  // Server component: pick 3 random products for the promo
  const all = getAllAlphabetical();
  const available = all.length ? all.slice() : [];
  // simple shuffle and take first 3
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  const picked = available.slice(0, 3);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Promocje</h3>
      <div className="flex gap-3 overflow-x-auto">
        {picked.map((p) => {
          const newPrice = (p.price * 0.9).toFixed(2);
          return (
            <article key={p.id} className="bg-white/5 p-3 rounded-lg min-w-[200px]">
              <Link href={`/product-list/${p.id}`} className="no-underline text-inherit">
                <div className="font-semibold mb-1.5">{p.name}</div>
                <div className="text-gray-300 text-sm">
                  <span className="line-through mr-2">{p.price} zł</span>
                  <span className="text-green-400 font-bold">{newPrice} zł</span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
