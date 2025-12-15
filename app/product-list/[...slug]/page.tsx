import React from "react";
import { notFound } from "next/navigation";
import ProductListClient from "../ProductListClient";
import Link from "next/link";
import { getAllByCategory, getById, getCategories, slugifyCategory, Product } from "@/lib/products";

type Props = {
  params: { slug: string[] };
};

export default async function ProductListCatchAll({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug ?? [];

  if (!slug || slug.length === 0) return notFound();

  // If at least one segment: try to resolve first segment to a known category
  const categorySlug = slug[0];
  const categories = getCategories();
  const matched = categories.find((c) => slugifyCategory(c) === categorySlug.toLowerCase());
  if (!matched) return notFound();

  // If only one segment: show category listing
  if (slug.length === 1) {
    const products: Product[] = getAllByCategory(matched);
    if (!products || products.length === 0) return notFound();

    return (
      <div>
        <h2 className="text-[28px] text-[#181817] mb-4">Produkty: {matched}</h2>

        <div className="mb-4">
          <div className="font-semibold mb-2">Kategorie</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={c} href={`/product-list/${slugifyCategory(c)}`} className="px-3 py-1 rounded bg-sky-100 text-sky-800 no-underline">
                {c}
              </Link>
            ))}
          </div>
        </div>

        <ProductListClient products={products} basePath={`/product-list/${categorySlug}`} />
      </div>
    );
  }

  // If multiple segments: last segment expected to be product id
  const last = slug[slug.length - 1];
  const id = parseInt(last, 10);
  if (!Number.isInteger(id)) return notFound();

  const product = getById(id);
  if (!product) return notFound();

  const imageUrl = "/politechnika-krakowska-logo.svg";

  return (
    <div>
      <h2 className="text-[28px] text-[#181817] mb-4">{product.name}</h2>
      <div className="mb-3">
        <Link href={`/product-list/${categorySlug}`} className="text-sky-600">◀ Zobacz wszystkie produkty z tej kategorii</Link>
      </div>
      <div className="flex gap-4 items-start mt-3">
        <img src={imageUrl} alt={product.name} className="w-[300px] h-[300px] object-contain rounded-lg bg-white" />
        <div>
          <p><strong>Typ:</strong> {product.type}</p>
          <p><strong>Kod:</strong> {product.code}</p>
          <p><strong>Cena:</strong> {product.price} zł</p>
          <p><strong>Ilość:</strong> {product.amount}</p>
          <p><strong>Data dodania:</strong> {product.date}</p>
          <h3>Opis</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
