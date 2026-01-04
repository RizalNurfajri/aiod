import { NextRequest, NextResponse } from 'next/server';
import { isValidProxyUrl, sanitizeResponse, validateRequestPayload, addSecurityHeaders } from '@/lib/security';

function isValidInstagramUrl(url: string): boolean {
    const patterns = [
        /^https?:\/\/(www\.)?instagram\.com\/(p|reel|reels|tv)\/[\w-]+/i,
        /^https?:\/\/(www\.)?instagram\.com\/[\w.]+\/(p|reel)\/[\w-]+/i,
    ];
    return patterns.some((pattern) => pattern.test(url));
}

interface ApiMediaItem {
    ext?: string;
    name?: string;
    type?: string;
    url?: string;
    thumbnail?: string;
}

interface GimitaResponse {
    success?: boolean;
    data?: ApiMediaItem[];
    thumbnail?: string;
}

/**
 * POST /api/instagram
 * Download Instagram video using gimita.id API
 * Response format: { success, data: [{ ext, name, type, url, thumbnail }] }
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

        if (!isValidInstagramUrl(url)) {
            return addSecurityHeaders(NextResponse.json(
                { success: false, error: 'Invalid Instagram URL' },
                { status: 400 }
            ));
        }

        // Call gimita.id API
        const apiUrl = `https://api.gimita.id/api/downloader/instagram?url=${encodeURIComponent(url)}`;

        const apiResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        if (!apiResponse.ok) {
            throw new Error(`API responded with status: ${apiResponse.status}`);
        }

        const data: GimitaResponse = await apiResponse.json();

        // Process media items and add thumbnail
        // For videos, extract thumbnail from Instagram post via OG image
        let thumbnail: string | undefined;
        let title: string | undefined;

        // Try to get thumbnail and title from oembed API
        try {
            const oembedUrl = `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}`;
            const oembedResponse = await fetch(oembedUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json',
                }
            });

            if (oembedResponse.ok) {
                const oembedData = await oembedResponse.json();
                thumbnail = oembedData.thumbnail_url;
                title = oembedData.title;
            }
        } catch (e) {

        }

        // Process media items and attach thumbnail (proxied to bypass CORS)
        const proxyThumbnail = thumbnail
            ? `/api/instagram/thumbnail?url=${encodeURIComponent(thumbnail)}`
            : '';

        const mediaItems = (data.data || []).map((item: ApiMediaItem) => {
            const itemThumb = item.thumbnail || thumbnail || '';
            return {
                ext: item.ext || 'mp4',
                name: item.name || 'Instagram Media',
                type: item.type || 'video',
                url: item.url || '',
                thumbnail: itemThumb ? `/api/instagram/thumbnail?url=${encodeURIComponent(itemThumb)}` : '',
            };
        });

        return addSecurityHeaders(NextResponse.json({
            success: true,
            data: mediaItems,
            thumbnail: proxyThumbnail,
            title: title || '',
        }));
    } catch (error) {

        return addSecurityHeaders(NextResponse.json(
            { success: false, error: 'Service temporarily unavailable' },
            { status: 500 }
        ));
    }
}

