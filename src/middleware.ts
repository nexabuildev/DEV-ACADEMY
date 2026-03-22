import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Inicializamos NextAuth SOLAMENTE con la configuración compatible con Edge
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isPublicRoute = 
    pathname === "/" || 
    pathname === "/login" || 
    pathname === "/register" || 
    pathname.startsWith("/api/auth");

  if (!isPublicRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return Response.redirect(new URL("/cursos", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};