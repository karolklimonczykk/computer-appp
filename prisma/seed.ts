/* eslint-disable @typescript-eslint/no-explicit-any */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
// 👇 U W A G A: import z wygenerowanego klienta, a NIE z '@prisma/client'


const prisma = new PrismaClient();
const DEFAULT_IMAGE = 'public\politechnika-krakowska-logo.svg';
// Typ danych z pliku JSON
type RawProduct = {
  id: number;
  code: string;
  name: string;
  type: string; // "procesor", "karta graficzna", "pamięć ram", "dysk"
  price: number;
  amount: number;
  description?: string;
  date?: string;
  image?: string;
};

// lokalne typy pomocnicze
type DbProduct = {
  id: number;
  price: any;
  name: string;
  code: string;
};

type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

async function seedProductsFromJson() {
  const filePath = path.join(__dirname, 'data', 'products.json');
  console.log('Czytam plik:', filePath);

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const rawProducts = JSON.parse(fileContent) as RawProduct[];

  // ---- Kategorie (z pola "type") ----
  const categoryNames = Array.from(
    new Set(rawProducts.map((p) => p.type.trim().toLowerCase())),
  );

  await prisma.category.createMany({
    data: categoryNames.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const categories = await prisma.category.findMany();
  const categoryByName = new Map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories.map((c: { name: string; id: any; }) => [c.name.toLowerCase(), c.id]),
  );

  // ---- Produkty ----
  await prisma.product.createMany({
    data: rawProducts.map((p) => ({
      code: p.code,
      name: p.name,
      description: p.description ?? null,
      price: p.price,
      amount: p.amount,
      imagePath: DEFAULT_IMAGE,
      categoryId: categoryByName.get(p.type.trim().toLowerCase())!,
    })),
    skipDuplicates: true,
  });

  console.log(
    `✔ Zaimportowano ${rawProducts.length} produktów i ${categoryNames.length} kategorii`,
  );
}

// pomocnicza funkcja do liczenia sumy zamówienia
function calcOrderTotal(items: { product: DbProduct; quantity: number }[]) {
  return items.reduce((sum, { product, quantity }) => {
    const priceNumber = Number(product.price);
    return sum + priceNumber * quantity;
  }, 0);
}

async function seedCartAndOrders() {
  // Weźmy kilka produktów z bazy
  const products = (await prisma.product.findMany({
    orderBy: { id: 'asc' },
    take: 10,
  })) as unknown as DbProduct[];

  if (products.length < 4) {
    console.warn(
      'Za mało produktów w bazie, aby stworzyć sensowne zamówienia.',
    );
    return;
  }

  // ---- Użytkownik ----
  const user = await prisma.user.upsert({
    where: { email: 'jan.kowalski@example.com' },
    update: {},
    create: {
      email: 'jan.kowalski@example.com',
      name: 'Jan Kowalski',
      // fullName: 'Jan Kowalski',
      // // UWAGA: w realnej aplikacji to powinien być hash bcrypt
      // password: 'hashed-password',
    },
  });

  // ---- Koszyk ----
  const cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  // Wyczyść wcześniejsze CartItem (żeby seed był powtarzalny)
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  // Dorzuć 2–3 produkty do koszyka
  await prisma.cartItem.createMany({
    data: [
      {
        cartId: cart.id,
        productId: products[0].id,
        quantity: 1,
      },
      {
        cartId: cart.id,
        productId: products[1].id,
        quantity: 2,
      },
      {
        cartId: cart.id,
        productId: products[2].id,
        quantity: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✔ Utworzono przykładowy koszyk');

  // ---- Zamówienia (co najmniej 4) ----
  // Wyczyść stare, żeby seed był powtarzalny
  await prisma.orderItem.deleteMany({ where: { order: { userId: user.id } } });
  await prisma.order.deleteMany({ where: { userId: user.id } });

  // Helper do tworzenia zamówienia
  async function createOrder(
    status: OrderStatus,
    items: { product: DbProduct; quantity: number }[],
    orderNumberSuffix: string,
  ) {
    const total = calcOrderTotal(items);

    const order = await prisma.order.create({
      data: {
        orderNumber: `ZAM-${orderNumberSuffix}`,
        status,
        totalAmount: total,
        userId: user.id,
      },
    });

    await prisma.orderItem.createMany({
      data: items.map(({ product, quantity }) => ({
        orderId: order.id,
        productId: product.id,
        quantity,
        unitPrice: product.price, // cena w momencie zakupu
        productName: product.name,
        productCode: product.code,
      })),
    });

    console.log(
      `✔ Utworzono zamówienie ${order.orderNumber} (status: ${status})`,
    );
  }

  // Tworzymy 4 zamówienia z różnymi statusami
  await createOrder(
    'PENDING',
    [
      { product: products[0], quantity: 1 },
      { product: products[1], quantity: 1 },
    ],
    '0001',
  );

  await createOrder(
    'PROCESSING',
    [
      { product: products[2], quantity: 2 },
      { product: products[3], quantity: 1 },
    ],
    '0002',
  );

  await createOrder(
    'SHIPPED',
    [
      { product: products[4], quantity: 1 },
      { product: products[5], quantity: 3 },
    ],
    '0003',
  );

  await createOrder(
    'DELIVERED',
    [
      { product: products[6], quantity: 1 },
      { product: products[7], quantity: 1 },
      { product: products[8], quantity: 2 },
    ],
    '0004',
  );
}

async function main() {
  await seedProductsFromJson(); // Task 8.2
  await seedCartAndOrders();    // Task 8.3
}

main()
  .then(() => {
    console.log('✅ Seeding zakończony');
  })
  .catch((e) => {
    console.error('❌ Błąd podczas seeda', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
