import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/youtube/thumbnail
 * Proxy for YouTube thumbnails to bypass CORS/referrer restrictions
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

        // Validate URL - only allow YouTube thumbnail domains
        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
            const allowedHosts = [
                'i.ytimg.com',
                'i9.ytimg.com',
                'img.youtube.com',
                'i1.ytimg.com',
                'i2.ytimg.com',
                'i3.ytimg.com',
                'i4.ytimg.com',
            ];
            if (!allowedHosts.some(host => parsedUrl.hostname === host || parsedUrl.hostname.endsWith('.ytimg.com'))) {
                throw new Error('Invalid YouTube thumbnail host');
            }
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        // Fetch the thumbnail
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.youtube.com/',
            },
            redirect: 'follow',
        });

        if (!response.ok) {
            console.error('YouTube thumbnail fetch failed:', response.status);
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

        // Return the image
        return new NextResponse(response.body, {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('YouTube thumbnail proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to load thumbnail' },
            { status: 500 }
        );
    }
}
