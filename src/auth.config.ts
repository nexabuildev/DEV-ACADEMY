import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  // Dejamos los providers vacíos aquí porque los pesados irán en el otro archivo
  providers: [], 
} satisfies NextAuthConfig;