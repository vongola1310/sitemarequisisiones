// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const url = req.nextUrl.pathname


    
    // Si no hay token, no está logueado → redirigir a /login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // 🔹 Ejemplo de control de roles:
    // Si la ruta empieza con /admin y el usuario no es admin → redirigir
    if (url.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // Si la ruta empieza con /evaluador y el usuario no es evaluador → redirigir
    if (url.startsWith("/evaluador") && token.role !== "evaluador") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    // Si todo bien, continuar
    return NextResponse.next()
  },
  {
    callbacks: {
      // Autorizado si existe token
      authorized: ({ token }) => !!token,
    },
  }
)

// Configuración de las rutas donde aplica el middleware
export const config = {
  matcher: [
    // Proteger todo excepto:
    // - /api/auth (rutas de autenticación de NextAuth)
    // - /_next/static (archivos estáticos)
    // - /_next/image (imágenes optimizadas)
    // - /favicon.ico
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}
