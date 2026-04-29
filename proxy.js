import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Redirect root to login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already logged in, don't let them see login/signup
  const publicRoutes = ['/login', '/signup'];
  if (publicRoutes.includes(pathname)) {
    if (token) {
      // Decode role from token to send to right dashboard
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      } catch {
        // If token is invalid, just let them through to login
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // Protect admin and agent routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/agent')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/agent/:path*', '/login', '/signup'],
};