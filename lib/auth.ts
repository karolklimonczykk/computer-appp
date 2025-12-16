/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import prisma from "./prisma";

const secret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  "";

if (!secret) {
  throw new Error("AUTH SECRET IS MISSING AT RUNTIME (check Vercel env + redeploy commit)");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret,
  trustHost: true,

  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? process.env.CLIENT_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) (session.user as any).id = user.id;
      return session;
    },
  },
});
