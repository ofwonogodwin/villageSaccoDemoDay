import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the token from the request
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token || token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/access-denied', req.url));
      }
    }

    // Dashboard routes protection
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      if (!token.isApproved) {
        return NextResponse.redirect(new URL('/access-denied', req.url));
      }
    }

    // Redirect authenticated users away from login/register pages
    if ((pathname === '/login' || pathname === '/register') && token && token.isApproved) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public routes
        if (
          pathname === '/' ||
          pathname === '/login' ||
          pathname === '/register' ||
          pathname === '/access-denied' ||
          pathname.startsWith('/api/auth/register') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon')
        ) {
          return true;
        }

        // Require authentication for protected routes
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
