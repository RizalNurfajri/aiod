import { NextRequest, NextResponse } from 'next/server';
import { addSecurityHeaders } from '@/lib/security';

function isValidFacebookUrl(url: string): boolean {
    const patterns = [
        /^https?:\/\/(www\.|m\.|web\.)?facebook\.com\/.+/i,
        /^https?:\/\/(www\.)?fb\.watch\/.+/i,
        /^https?:\/\/(www\.)?fb\.com\/.+/i,
    ];
    return patterns.some((pattern) => pattern.test(url));
}

/**
 * POST /api/facebook
 * Download Facebook video using gimita.id API
 * Response format: { data: { all_qualities: [...], best_url, best_quality } }
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

        if (!isValidFacebookUrl(url)) {
            return addSecurityHeaders(NextResponse.json(
                { success: false, error: 'Invalid Facebook URL' },
                { status: 400 }
            ));
        }

        // Call gimita.id API
        const apiUrl = `https://api.gimita.id/api/downloader/facebook?url=${encodeURIComponent(url)}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        if (!apiResponse.ok) {
            throw new Error(`API responded with status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        // Return the data directly
        return addSecurityHeaders(NextResponse.json({
            success: true,
            data: data.data,
        }));
    } catch (error) {

        return addSecurityHeaders(NextResponse.json(
            { success: false, error: 'Service temporarily unavailable' },
            { status: 500 }
        ));
    }
}
