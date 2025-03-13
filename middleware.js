import { NextResponse } from 'next/server';

export async function middleware(request) {
  const session = request.cookies.get('session');
  console.log('Middleware - Session exists:', !!session);

  // Only check admin status for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Middleware - Verifying admin status');
    
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin`, {
        method: 'POST',
        headers: {
          Cookie: `session=${session?.value || ''}`
        }
      });

      if (!response.ok) {
        console.log('Middleware - Admin verification failed');
        return NextResponse.redirect(new URL('/signin', request.url));
      }

      const data = await response.json();
      if (!data.isAdmin) {
        console.log('Middleware - User is not an admin');
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
