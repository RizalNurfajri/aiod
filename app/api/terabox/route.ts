import { NextRequest, NextResponse } from 'next/server';
import { isValidProxyUrl, sanitizeResponse, validateRequestPayload, addSecurityHeaders } from '@/lib/security';

function isValidTeraboxUrl(url: string): boolean {
    const patterns = [
        /^https?:\/\/(www\.)?terabox\.(app|com)\/.+/i,
        /^https?:\/\/(www\.)?1024tera\.com\/.+/i,
        /^https?:\/\/(www\.)?1024terabox\.com\/.+/i,
        /^https?:\/\/(www\.)?teraboxapp\.com\/.+/i,
    ];
    return patterns.some((pattern) => pattern.test(url));
}

/**
 * POST /api/terabox
 * Download Terabox files using gimita.id API
 * Response format: { files: [{ filename, size, size_format, thumbnail, download, direct_link }], total }
 */
export async function POST(request: NextRequest) {
    try {
        let body;
        try {
            body = await request.json();
        } catch {
            return addSecurityHeaders(NextResponse.json(
                { success: false, error: 'Invalid JSON payload' },
                { status: 400 }
            ));
        }

        if (!body.url || typeof body.url !== 'string') {
            return addSecurityHeaders(NextResponse.json(
                { success: false, error: 'URL is required' },
                { status: 400 }
            ));
        }

        const url = body.url.trim();

        if (!isValidTeraboxUrl(url)) {
            return addSecurityHeaders(NextResponse.json(
                { success: false, error: 'Invalid Terabox URL' },
                { status: 400 }
            ));
        }

        // Call gimita.id API
        const apiUrl = `https://api.gimita.id/api/downloader/terabox?url=${encodeURIComponent(url)}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        if (!apiResponse.ok) {
            throw new Error(`API responded with status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        // Wrap thumbnail URLs with our proxy to bypass CORS
        const files = (data.files || []).map((file: { thumbnail?: string;[key: string]: unknown }) => ({
            ...file,
            thumbnail: file.thumbnail
                ? `/api/terabox/thumbnail?url=${encodeURIComponent(file.thumbnail)}`
                : '',
        }));

        // Return the files array
        return addSecurityHeaders(NextResponse.json({
            success: true,
            files,
            total: data.total || 0,
        }));
    } catch (error) {

        return addSecurityHeaders(NextResponse.json(
            { success: false, error: 'Service temporarily unavailable' },
            { status: 500 }
        ));
    }
}
