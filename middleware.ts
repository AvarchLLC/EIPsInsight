import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from "next-auth/middleware";

// Enhanced middleware with auth protection
export default withAuth(
  function middleware(req) {
    const path: string = req.nextUrl.pathname;
    const token  = req.nextauth.token;

    // Admin-only routes
    if (path.startsWith('/admin')) {
      if (!token || token.role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
      }
    }

    // Moderator+ routes  
    if (path.startsWith('/moderate') || path.startsWith('/manage')) {
      if (!token || (token.role !== 'admin' && token.role !== 'moderator')) {
        return NextResponse.redirect(new URL('/auth/unauthorized', req.url));
      }
    }

    // Premium user routes
    if (path.startsWith('/premium') || path.startsWith('/blog/create')) {
      if (!token || (token.role !== 'admin' && token.role !== 'moderator' && token.role !== 'premium_user')) {
        return NextResponse.redirect(new URL('/auth/upgrade', req.url));
      }
    }

    // User-only routes (requires login)
    if (path.startsWith('/profile') || path.startsWith('/dashboard') || path.startsWith('/settings')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    // Check if user is active
    if (token && token.isActive === false) {
      return NextResponse.redirect(new URL('/auth/suspended', req.url));
    }

    // Original redirects
    if (path.toLowerCase() === '/reviewers') {
      return NextResponse.redirect(new URL('/Reviewers', req.url));
    }

    if (path.toLowerCase() === '/analytics') {
      return NextResponse.redirect(new URL('/Analytics', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Public routes that don't require auth
        const publicRoutes = [
          '/',
          '/about',
          '/contact',
          '/blog',
          '/eips',
          '/ercs',
          '/api/public',
          '/auth',
          '/signin',
          '/signup'
        ];

        // Always allow API auth routes
        if (path.startsWith('/api/auth')) {
          return true;
        }

        // Check if route is public
        if (publicRoutes.some(route => path === route || path.startsWith(route + '/')) || 
            path.includes('/_next/') || 
            path.includes('/favicon.ico') ||
            path.includes('/public/') ||
            path === '/') {
          return true;
        }

        // Protected routes require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ]
};
