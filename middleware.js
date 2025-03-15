import { NextResponse } from 'next/server';

export function middleware(request) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Get response
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });

  // Set new response headers
  response.headers.set('X-Frame-Options', 'ALLOWALL');
  response.headers.set(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://*.gohighlevel.com https://app.gohighlevel.com https://*.leadconnectorhq.com;"
  );

  return response;
}

export const config = {
  matcher: '/:path*',
}; 