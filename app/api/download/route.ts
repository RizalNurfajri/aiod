import { NextRequest, NextResponse } from 'next/server';
import { downloadVideo } from '@/lib/ssstik';
import { checkRateLimit, getClientIP } from '@/lib/rate-limiter';
import {
    isValidTikTokUrl,
    sanitizeUrl,
    validateRequestPayload,
    sanitizeResponse,
    isValidUserAgent
} from '@/lib/security';

/** Security headers for all responses */
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/** Add security headers to response */
function addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

/**
 * POST /api/download
 * Download TikTok video with security validation
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limiting check
        const clientIP = getClientIP(request.headers);
        const rateLimit = checkRateLimit(clientIP);

        if (!rateLimit.success) {
            return addSecurityHeaders(
                NextResponse.json(
                    { success: false, error: 'Too many requests. Please try again later.' },
                    { status: 429 }
                )
            );
        }

        // User-Agent validation
        const userAgent = request.headers.get('user-agent');
        if (!isValidUserAgent(userAgent)) {
            return addSecurityHeaders(
                NextResponse.json(
                    { success: false, error: 'Invalid or missing User-Agent' },
                    { status: 403 }
                )
            );
        }

        // Parse request body
        let body;
        try {
            body = await request.json();
        } catch {
            return addSecurityHeaders(
                NextResponse.json(
                    { success: false, error: 'Invalid JSON payload' },
                    { status: 400 }
                )
            );
        }

        // Validate payload structure
        const payloadValidation = validateRequestPayload(body);
        if (!payloadValidation.valid) {
            return addSecurityHeaders(
                NextResponse.json(
                    { success: false, error: payloadValidation.error },
                    { status: 400 }
                )
            );
        }

        // Sanitize and validate URL
        const sanitizedUrl = sanitizeUrl(body.url);
        if (!isValidTikTokUrl(sanitizedUrl)) {
            return addSecurityHeaders(
                NextResponse.json(
                    { success: false, error: 'Invalid TikTok URL. Please provide a valid TikTok video link.' },
                    { status: 400 }
                )
            );
        }

        // Download and sanitize video data
        const videoData = await downloadVideo(sanitizedUrl);
        const sanitizedData = sanitizeResponse(videoData);

        return addSecurityHeaders(
            NextResponse.json({ success: true, data: sanitizedData })
        );
    } catch (error) {
        console.error('TikTok API Error:', error);

        const errorMessage = process.env.NODE_ENV === 'development'
            ? (error instanceof Error ? error.message : 'Unknown error')
            : 'Service temporarily unavailable. Please try again.';

        return addSecurityHeaders(
            NextResponse.json(
                { success: false, error: errorMessage },
                { status: 500 }
            )
        );
    }
}
