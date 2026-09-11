import type { NextAuthConfig } from "next-auth";
import type { NextRequest } from "next/server";

// Config en forma de función ("lazy initialization" de Auth.js): en Cloudflare
// Workers, `process.env` solo está poblado dentro del manejador de la petición,
// así que no podemos leerlo en un objeto top-level, hay que leerlo aquí dentro,
// que se vuelve a ejecutar en cada petición.
export function authConfig(_req?: NextRequest): NextAuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    // Cloudflare Workers no es un host que Auth.js reconozca de fábrica como
    // Vercel; sin esto rechaza toda petición con "UntrustedHost".
    trustHost: true,
    pages: {
      signIn: "/login",
    },
    // Dejamos los providers vacíos aquí porque los pesados irán en el otro archivo
    providers: [],
  };
}
