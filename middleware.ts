import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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


  return NextResponse.next();
}
