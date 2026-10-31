import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ['/acesso', '/api/auth/login', '/api/auth/logout', '/favicon.ico', '/manifest.json', '/icons'];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p)) || pathname === '/';

  if (isPublic) {
    return NextResponse.next();
  }

  // Verificar existência de cookie de sessão
  const hasSessionCookie = request.cookies.has('ganley_session');

  if (!hasSessionCookie) {
    // Redirecionar para tela de desbloqueio
    const loginUrl = new URL('/acesso', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepta rotas exceto assets estáticos
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)',
  ],
};
