import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  // Dejamos los providers vacíos aquí porque los pesados irán en el otro archivo
  providers: [],
} satisfies NextAuthConfig;