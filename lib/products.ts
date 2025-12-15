import fs from "fs";
import path from "path";

export type Product = {
  id: number;
  code: string;
  name: string;
  type: string;
  price: number;
  amount: number;
  description: string;
  date: string;
  image: string;
};

const dataFile = path.join(process.cwd(), "data", "products.json");

function readAll(): Product[] {
  const raw = fs.readFileSync(dataFile, "utf8");
  return JSON.parse(raw) as Product[];
}

function writeAll(products: Product[]) {
  fs.writeFileSync(dataFile, JSON.stringify(products, null, 2), "utf8");
}

export function getAllAlphabetical(): Product[] {
  const products = readAll();
  return products.slice().sort((a, b) => a.name.localeCompare(b.name, "pl"));
}

export function getAllNewest(): Product[] {
  const products = readAll();
  return products
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllInStock(): Product[] {
  return readAll().filter((p) => p.amount > 0);
}

export function getAllOutOfStock(): Product[] {
  return readAll().filter((p) => p.amount === 0);
}

export function getAllByCategory(type: string): Product[] {
  return readAll().filter((p) => p.type === type);
}

export function getCategories(): string[] {
  const products = readAll();
  const set = new Set<string>();
  for (const p of products) set.add(p.type);
  return Array.from(set);
}

export function slugifyCategory(cat: string) {
  // lower-case, remove diacritics, replace spaces with dashes, remove invalid chars
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[{\u0300-\u036f}]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-ąćęłńóśżź-]/gi, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getById(id: number): Product | undefined {
  return readAll().find((p) => p.id === id);
}

// Changes amount to the provided newAmount and persists to data file.
export function changeAmount(id: number, newAmount: number): Product | undefined {
  const products = readAll();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  products[idx].amount = newAmount;
  writeAll(products);
  return products[idx];
}
