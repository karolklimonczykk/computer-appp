/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import prisma from "./prisma";
import type { NextRequest } from "next/server";
function createAuth() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET / NEXTAUTH_SECRET");

  return NextAuth({
    secret,
    trustHost: true,
    adapter: PrismaAdapter(prisma),
    providers: [
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID || process.env.CLIENT_ID!,
        clientSecret: process.env.AUTH_GITHUB_SECRET || process.env.CLIENT_SECRET!,
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        if (session.user) (session.user as any).id = user.id;
        return session;
      },
    },
  });
}

// cache w globalThis (żeby nie tworzyć NextAuth w kółko)
const g = globalThis as unknown as { __auth?: ReturnType<typeof createAuth> };
function getAuth() {
  if (!g.__auth) g.__auth = createAuth();
  return g.__auth;
}

export const handlers = {
  GET: (req: NextRequest) => getAuth().handlers.GET(req),
  POST: (req: NextRequest) => getAuth().handlers.POST(req),
};

export const auth: ReturnType<typeof createAuth>["auth"] = (...args) =>
  (getAuth().auth as any)(...args);

export const signIn: ReturnType<typeof createAuth>["signIn"] = (...args) =>
  (getAuth().signIn as any)(...args);

export const signOut: ReturnType<typeof createAuth>["signOut"] = (...args) =>
  (getAuth().signOut as any)(...args);

