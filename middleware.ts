import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Content Security Policy
    const cspDirectives = [
        "default-src 'self'",
        "img-src 'self' https://*.tiktokcdn.com https://*.tiktokcdn-us.com https://*.cdninstagram.com https://*.fbcdn.net https://*.ytimg.com https://*.googleusercontent.com data: blob:",
        "media-src 'self' https://*.tiktokcdn.com https://*.cdninstagram.com https://*.fbcdn.net blob:",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "connect-src 'self' https://www.tikwm.com https://www.tiktok.com https://api.gimita.id https://www.instagram.com",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ];

    response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|logo.png).*)',
    ],
};
