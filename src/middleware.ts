import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
// In production, use Redis or another distributed store
const rateLimit = new Map<string, { count: number; timestamp: number }>();

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Set different CSP for development and production
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    // More permissive CSP for development (allows unsafe-eval for hot reloading)
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  } else {
    // Stricter CSP for production
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  }
  
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }
    
    // Apply rate limiting for API routes
    const ip = request.ip || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 60; // 60 requests per minute
    
    const rateData = rateLimit.get(ip) || { count: 0, timestamp: now };
    
    // Reset if outside window
    if (now - rateData.timestamp > windowMs) {
      rateData.count = 0;
      rateData.timestamp = now;
    }
    
    rateData.count++;
    rateLimit.set(ip, rateData);
    
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - rateData.count).toString());
    
    if (rateData.count > maxRequests) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      });
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to all pages
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
}; 