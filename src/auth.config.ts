import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  // Cloudflare Workers no es un host que Auth.js reconozca de fábrica como
  // Vercel; sin esto rechaza toda petición con "UntrustedHost".
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  // Dejamos los providers vacíos aquí porque los pesados irán en el otro archivo
  providers: [],
} satisfies NextAuthConfig;