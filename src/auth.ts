import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { authConfig } from "./auth.config"
import type { Adapter } from "next-auth/adapters" // Importamos el tipo base

// Le decimos a TypeScript que nuestros usuarios y sesiones ahora tienen un 'role' e 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Añadido id
      role: string;
    } & DefaultSession["user"]
  }
  interface User {
    role: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // EL CAMBIO ESTÁ AQUÍ: Añadimos "as Adapter" para evitar el error de Vercel
  adapter: PrismaAdapter(db) as Adapter, 
  session: { strategy: "jwt" },
  
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

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) return user as any; // any temporal para evitar conflicto en authorize
        return null;
      }
    })
  ],
})