import { NextRequest, NextResponse } from 'next/server';
import { addSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/instagram/thumbnail
 * Proxy for Instagram thumbnails to bypass CORS
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.json(
                { error: 'URL parameter is required' },
                { status: 400 }
            );
        }

        // Validate URL
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                throw new Error('Invalid protocol');
            }
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Fetch the thumbnail with appropriate headers
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.instagram.com/',
                'Origin': 'https://www.instagram.com',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site',
            },
            redirect: 'follow',
        });

        if (!response.ok) {

            return NextResponse.json(
                { error: 'Failed to fetch thumbnail' },
                { status: response.status }
            );
        }

        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const contentLength = response.headers.get('content-length');

        // Create response headers
        const responseHeaders = new Headers();
        responseHeaders.set('Content-Type', contentType);
        responseHeaders.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
        responseHeaders.set('Access-Control-Allow-Origin', '*');

        if (contentLength) {
            responseHeaders.set('Content-Length', contentLength);
        }

        const buffer = await response.arrayBuffer();

        // Return the image
        return addSecurityHeaders(new NextResponse(buffer, {
            status: 200,
            headers: responseHeaders,
        }));
    } catch (error) {

        return addSecurityHeaders(NextResponse.json(
            { error: 'Failed to load thumbnail' },
            { status: 500 }
        ));
    }
}
