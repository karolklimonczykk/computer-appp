import React from "react";
import ProductListClient from "../ProductListClient";
import { getAllAlphabetical, getCategories, slugifyCategory } from "../../../lib/products";

export default function ProductsDefault() {
  const products = getAllAlphabetical();
  const categories = getCategories();

  return (
    <div>
      <h2 className="text-[28px] text-[#181817] mb-4">Lista produktów</h2>

      <div className="mb-4">
        <div className="font-semibold mb-2">Kategorie</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <a key={c} href={`/product-list/${slugifyCategory(c)}`} className="px-3 py-1 rounded bg-sky-100 text-sky-800 no-underline">
              {c}
            </a>
          ))}
        </div>
      </div>

      <ProductListClient products={products} />
    </div>
  );
}
