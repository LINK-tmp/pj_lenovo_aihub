import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: UserRole;
    organizationName: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      organizationName: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    organizationName: string;
  }
}

export async function requireAuth(role?: UserRole) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (role && session.user.role !== role) throw new Error("Unauthorized");
  return session;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationName: user.organizationName,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.organizationName = user.organizationName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.organizationName = token.organizationName;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
