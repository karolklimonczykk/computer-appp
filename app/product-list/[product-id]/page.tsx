import React from "react";
import { notFound } from "next/navigation";
import {
  getById,
  getAllByCategory,
  getCategories,
  slugifyCategory,
  Product,
} from "@/lib/products";
import ProductListClient from "../ProductListClient";
import Link from "next/link";
import ImageModalClient from "./ImageModalClient";

type ProductPageProps = {
  // w tej wersji Next params jest PROMISE
  params: Promise<{ "product-id": string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const resolved = await params;
  const raw = resolved["product-id"] ?? "";

  // Jeśli liczba → traktuj jako id produktu
  const id = parseInt(raw, 10);
  if (Number.isInteger(id)) {
    const product: Product | undefined = getById(id);
    if (!product) return notFound();

    // jedno wspólne zdjęcie dla wszystkich produktów
    const imageUrl = "/politechnika-krakowska-logo.svg";

    return (
      <div>
        <h2 className="text-[28px] text-[#181817] mb-4">{product.name}</h2>

        <div className="mb-3">
          <Link
            href={`/product-list/${slugifyCategory(product.type)}`}
            className="text-sky-600"
          >
            ◀ Zobacz wszystkie produkty z tej kategorii
          </Link>
        </div>

        <div className="flex gap-4 items-start mt-3">
          <div>
            <ImageModalClient
              productId={product.id}
              src={imageUrl}
              alt={product.name}
            />
          </div>
          <div>
            <p>
              <strong>Typ:</strong> {product.type}
            </p>
            <p>
              <strong>Kod:</strong> {product.code}
            </p>
            <p>
              <strong>Cena:</strong> {product.price} zł
            </p>
            <p>
              <strong>Ilość:</strong> {product.amount}</p>
            <p>
              <strong>Data dodania:</strong> {product.date}
            </p>
            <h3>Opis</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    );
  }

  // Jeśli nie liczba → traktuj jako slug kategorii
  const categorySlug = raw.toLowerCase();
  const matched = getCategories().find(
    (c) => slugifyCategory(c) === categorySlug
  );
  if (!matched) return notFound();

  const products = getAllByCategory(matched);
  if (!products || products.length === 0) return notFound();

  const categories = getCategories();

  return (
    <div>
      <h2 className="text-[28px] text-[#181817] mb-4">Produkty: {matched}</h2>

      <div className="mb-4">
        <div className="font-semibold mb-2">Kategorie</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c}
              href={`/product-list/${slugifyCategory(c)}`}
              className="px-3 py-1 rounded bg-sky-100 text-sky-800 no-underline"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      <ProductListClient
        products={products}
        basePath={`/product-list/${categorySlug}`}
      />
    </div>
  );
}
