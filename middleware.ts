import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if the user is attempting to access an admin path
    const isAdminPath = path.startsWith('/admin') && path !== '/admin/login';

    // Check if the user is attempting to access an alumni (main) path
    const alumniPaths = ['/dashboard', '/alumni', '/chat', '/events', '/jobs', '/profile'];
    const isAlumniPath = alumniPaths.some((p) => path.startsWith(p));

    // Case 1: Unauthenticated user
    if (!token) {
      if (isAdminPath) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
      if (isAlumniPath) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }

    const role = (token as any).role;

    // Case 2: Authenticated user with role 'administrator'
    if (role === 'administrator') {
      if (path === '/admin/login' || path === '/login' || path === '/register') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      if (isAlumniPath) {
        // If an admin tries to access alumni dashboard, redirect to admin panel
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    // Case 3: Authenticated user with role 'alumni'
    if (role === 'alumni') {
      if (path === '/login' || path === '/register' || path === '/admin/login') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      if (isAdminPath) {
        // If alumni tries to access admin panel, redirect to alumni dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // By returning true here, the middleware function always runs,
      // allowing us to handle all unauthenticated and authenticated redirection logic dynamically.
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/alumni/:path*',
    '/chat/:path*',
    '/events/:path*',
    '/jobs/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};
