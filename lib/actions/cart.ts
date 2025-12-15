'use server';

import prisma from '@/lib/prisma';

// 2a. Pobiera koszyk użytkownika wraz z produktami i kategoriami
export async function getCartWithItems(userId: string) {
  if (!userId) return null;

  return prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

// 2b. Oblicza sumę wartości koszyka
export async function getCartTotal(userId: string) {
  const cart = await getCartWithItems(userId);
  if (!cart) return 0;

  return cart.items.reduce((sum, item) => {
    const price = Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);
}

// 2c. Lista użytkowników z ich koszykami
export async function getAllUsersWithCarts() {
  return prisma.user.findMany({
    include: {
      cart: {
        include: {
          items: true,
        },
      },
    },
    orderBy: {
      email: 'asc',
    },
  });
}

// 2d. Przeniesienie produktów z jednego koszyka do drugiego
export async function transferCart(fromUserId: string, toUserId: string) {
  if (!fromUserId || !toUserId) {
    throw new Error('Both fromUserId and toUserId are required');
  }

  if (fromUserId === toUserId) {
    throw new Error('Nie można przenieść koszyka do tego samego użytkownika');
  }

  const fromCart = await prisma.cart.findUnique({
    where: { userId: fromUserId },
    include: { items: true },
  });

  if (!fromCart || fromCart.items.length === 0) {
    // nie ma czego przenosić
    return;
  }

  const toCart = await prisma.cart.upsert({
    where: { userId: toUserId },
    update: {},
    create: { userId: toUserId },
  });

  // dodaj / zsumuj produkty w docelowym koszyku
  for (const item of fromCart.items) {
    await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: toCart.id,
          productId: item.productId,
        },
      },
      update: {
        quantity: {
          increment: item.quantity,
        },
      },
      create: {
        cartId: toCart.id,
        productId: item.productId,
        quantity: item.quantity,
      },
    });
  }

  // wyczyść koszyk źródłowy
  await prisma.cartItem.deleteMany({
    where: { cartId: fromCart.id },
  });
}
