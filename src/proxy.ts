import NextAuth from "next-auth";
import type { NextFetchEvent, NextRequest } from "next/server";
import { authConfig } from "@/auth.config";

// Construimos la instancia de NextAuth DENTRO de la función exportada, no en
// el top-level del módulo: en Cloudflare Workers `process.env` (con
// AUTH_SECRET) solo está poblado dentro del manejador de la petición. Si se
// crea aquí arriba, `authConfig()` ya lee el secret congelado como
// `undefined`. (No podemos usar el config-como-función de Auth.js aquí,
// porque en ese modo `auth(callback)` devuelve una Promise en vez de una
// función síncrona, y Next.js exige que `proxy.ts` exporte una función).
export default async function proxy(req: NextRequest, event: NextFetchEvent) {
  const { auth } = NextAuth(authConfig(req));
  // El tipo de retorno de `auth(callback)` está sobrecargado en la librería
  // de forma que TS no infiere bien esta rama concreta; el comportamiento en
  // runtime es el documentado (NextMiddleware), así que forzamos el tipo.
  const wrapped = auth((authedReq) => {
    const isLoggedIn = !!authedReq.auth;
    const { pathname } = authedReq.nextUrl;

    const isPublicRoute =
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname.startsWith("/api/auth");

    if (!isPublicRoute && !isLoggedIn) {
      return Response.redirect(new URL("/login", authedReq.nextUrl));
    }

    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
      return Response.redirect(new URL("/cursos", authedReq.nextUrl));
    }
  }) as unknown as (request: NextRequest, event: NextFetchEvent) => Promise<Response>;
  return wrapped(req, event);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
