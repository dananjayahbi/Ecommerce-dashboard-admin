import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/register', '/api/init', '/api/auth/init', '/api/db-init'];
  const isPublicPath = publicPaths.some((publicPath) => path.startsWith(publicPath));
  
  // Allow all API routes to pass through (especially for auth)
  if (path.startsWith('/api/auth') || path.startsWith('/api/db-init')) {
    return NextResponse.next();
  }
  
  // Get token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isLoggedIn = !!token;
  
  // Redirect logic
  if (isPublicPath && isLoggedIn) {
    // If user is logged in and trying to access public route, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isPublicPath && !isLoggedIn && !path.startsWith('/api')) {
    // If user is not logged in and trying to access protected route, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 