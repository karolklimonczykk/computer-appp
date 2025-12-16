/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import prisma from "./prisma";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET, // <— DODAJ
  trustHost: true, // <— DODAJ (na Vercelu pomaga z host/url)

  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? process.env.CLIENT_ID!,        // <— ZMIEŃ
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.CLIENT_SECRET!, // <— ZMIEŃ
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
});
