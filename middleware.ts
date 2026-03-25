import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'eipsinsightv3';
const AUTH_REALM = 'EIPs Insight V3 Admin';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!isAuthorized(authHeader)) {
    return new NextResponse('Authentication required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': `Basic realm="${AUTH_REALM}", charset="UTF-8"`,
      },
    });
  }

  const path = request.nextUrl.pathname;

  // Check if the path is '/reviewers' in any case format
  if (path.toLowerCase() === '/reviewers') {
    console.log("redirected");
    return NextResponse.redirect(new URL('/Reviewers', request.url));
  }

  if (path.toLowerCase() === '/analytics') {
    console.log("redirected");
    return NextResponse.redirect(new URL('/Analytics', request.url));
  }

  if (path.toLowerCase() === '/about') {
    console.log("redirected");
    return NextResponse.redirect(new URL('/About', request.url));
  }


  return NextResponse.next();
}

function isAuthorized(authHeader: string | null): boolean {
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;

  try {
    const encodedCredentials = authHeader.split(' ')[1] ?? '';
    const decoded = atob(encodedCredentials);
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex < 0) return false;

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);

    return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

export const config = {
  matcher: '/:path*',
};
