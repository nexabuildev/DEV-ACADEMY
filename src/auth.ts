import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import GitLab from "next-auth/providers/gitlab"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import type { Adapter } from "next-auth/adapters"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }
  interface User {
    role: string;
  }
}


export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as any, 
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },

  providers: [
    GitHub,
    Google,
    GitLab,
    Credentials({
      name: "Tu Cuenta",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) return null;

        try {
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (passwordsMatch || credentials.password === user.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        } catch (e) {
          console.error("Error criptográfico:", e);
        }

        return null;
      }
    })
  ],
})