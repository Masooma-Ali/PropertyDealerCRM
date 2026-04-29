import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Public routes — always accessible
  const publicRoutes = ['/login', '/signup'];
  if (publicRoutes.includes(pathname)) {
    // If already logged in, redirect away from login/signup
    if (token) {
      return NextResponse.redirect(new URL('/api/auth/me', request.url));
    }
    return NextResponse.next();
  }

  // Protect all admin and agent routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/agent')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/agent/:path*', '/login', '/signup'],
};