"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";

type Props = { products: Product[]; basePath?: string };

export default function ProductListClient({ products, basePath }: Props) {
  const [sortMode, setSortMode] = useState<"alphabetical" | "newest">(
    "alphabetical"
  );
  const [onlyInStock, setOnlyInStock] = useState(false);

  const displayed = useMemo(() => {
    let list = products.slice();
    if (onlyInStock) list = list.filter((p) => p.amount > 0);
    if (sortMode === "alphabetical") {
      list.sort((a, b) => a.name.localeCompare(b.name, "pl"));
    } else {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return list;
  }, [products, sortMode, onlyInStock]);

  function normalizeImagePath(img: string) {
    if (!img) return "";
    if (img.startsWith("public/")) return "/" + img.replace(/^public\//, "");
    if (img.startsWith("/")) return img;
    return "/" + img;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center mb-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="sort"
            checked={sortMode === "alphabetical"}
            onChange={() => setSortMode("alphabetical")}
            className="accent-sky-500"
          />
          <span>Alfabetycznie</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="sort"
            checked={sortMode === "newest"}
            onChange={() => setSortMode("newest")}
            className="accent-sky-500"
          />
          <span>Najnowsze</span>
        </label>

        <label className="flex items-center gap-2 ml-4">
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="accent-sky-500"
          />
          <span>Tylko dostępne</span>
        </label>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] gap-3">
        {displayed.map((p) => {
          const href = basePath ? `${basePath.replace(/\/$/, "")}/${p.id}` : `/product-list/${p.id}`;
          return (
            <article key={p.id} className="bg-white/5 p-3 rounded-lg">
              <Link href={href} className="no-underline text-inherit">
                <div className="font-semibold mb-1.5">{p.name}</div>
                <div className="text-gray-300 text-sm">{p.type} • {p.price} zł • ilość: {p.amount}</div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
