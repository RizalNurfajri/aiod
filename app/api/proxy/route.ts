import { NextRequest, NextResponse } from 'next/server';
import { addSecurityHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';

/**
 * GET /api/proxy
 * Streams file download from various sources
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const url = searchParams.get('url');
        const filename = searchParams.get('filename') || 'download';

        if (!url) {
            return NextResponse.json(
                { error: 'URL parameter is required' },
                { status: 400 }
            );
        }

        // Basic URL validation
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

        // Sanitize filename
        const sanitizedFilename = filename
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/\.\.+/g, '.')
            .substring(0, 255);

        // Determine appropriate headers based on the source domain
        const hostname = parsedUrl.hostname;
        let referer = 'https://www.google.com/';
        let origin = '';

        if (hostname.includes('youconvert') || hostname.includes('ytmp3') || hostname.includes('y2mate')) {
            referer = 'https://youconvert.org/';
            origin = 'https://youconvert.org';
        } else if (hostname.includes('tiktok')) {
            referer = 'https://www.tiktok.com/';
        } else if (hostname.includes('instagram') || hostname.includes('igram')) {
            referer = 'https://www.instagram.com/';
        } else if (hostname.includes('facebook') || hostname.includes('fbcdn')) {
            referer = 'https://www.facebook.com/';
        }




        // Build headers
        const headers: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'audio/mpeg, video/mp4, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': referer,
            'Sec-Fetch-Dest': 'audio',
            'Sec-Fetch-Mode': 'no-cors',
            'Sec-Fetch-Site': 'cross-site',
        };

        if (origin) {
            headers['Origin'] = origin;
        }

        // Fetch the file
        const response = await fetch(url, {
            method: 'GET',
            headers,
            redirect: 'follow',
        });




        if (!response.ok) {

            return addSecurityHeaders(NextResponse.json(
                { error: `Failed to fetch: ${response.status}` },
                { status: response.status }
            ));
        }

        const responseContentType = response.headers.get('content-type') || '';

        // If we got HTML, the link might have expired or need different handling
        if (responseContentType.includes('text/html')) {

            // Try to get the actual download by following the page
            return NextResponse.json(
                { error: 'Download link expired or invalid. Please try again.' },
                { status: 400 }
            );
        }

        // Determine content type
        let contentType = responseContentType;
        if (sanitizedFilename.endsWith('.mp3') || contentType.includes('audio')) {
            contentType = 'audio/mpeg';
        } else if (sanitizedFilename.endsWith('.mp4') || contentType.includes('video')) {
            contentType = 'video/mp4';
        }

        // Create response headers
        const responseHeaders = new Headers();
        responseHeaders.set('Content-Type', contentType);
        responseHeaders.set('Content-Disposition', `attachment; filename="${sanitizedFilename}"`);
        responseHeaders.set('Cache-Control', 'no-cache');

        const contentLength = response.headers.get('content-length');
        if (contentLength) {
            responseHeaders.set('Content-Length', contentLength);
        }

        // Stream the response
        const buffer = await response.arrayBuffer();
        return addSecurityHeaders(new NextResponse(buffer, {
            status: 200,
            headers: responseHeaders,
        }));
    } catch (error) {

        return addSecurityHeaders(NextResponse.json(
            { error: 'Download failed' },
            { status: 500 }
        ));
    }
}
