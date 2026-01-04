import { NextRequest, NextResponse } from 'next/server';

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer',
};

function addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

function isValidYoutubeUrl(url: string): boolean {
    const patterns = [
        /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
        /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/i,
        /^https?:\/\/youtu\.be\/[\w-]+/i,
        /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/i,
    ];
    return patterns.some((pattern) => pattern.test(url));
}

/**
 * POST /api/youtube
 * action: 'info' - get video info with available formats
 * action: 'download' - download with format_id and type
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
        const action = body.action || 'info';

        if (!isValidYoutubeUrl(url)) {
            return addSecurityHeaders(NextResponse.json(
                { success: false, error: 'Invalid YouTube URL' },
                { status: 400 }
            ));
        }

        if (action === 'info') {
            // Get video info with formats
            const apiUrl = `https://api.gimita.id/api/downloader/ytinfo?url=${encodeURIComponent(url)}`;

            const apiResponse = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (!apiResponse.ok) {
                throw new Error(`API responded with status: ${apiResponse.status}`);
            }

            const data = await apiResponse.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to get video info');
            }

            // Wrap thumbnail URL with proxy to bypass CORS
            const thumbnailUrl = data.thumbnail
                ? `/api/youtube/thumbnail?url=${encodeURIComponent(data.thumbnail)}`
                : '';

            return addSecurityHeaders(NextResponse.json({
                success: true,
                data: {
                    title: data.title,
                    uploader: data.uploader,
                    thumbnail: thumbnailUrl,
                    duration: data.duration,
                    audio_formats: data.audio_formats || [],
                    video_formats: data.video_formats || [],
                },
            }));
        } else if (action === 'download') {
            // Download with format_id and type
            const formatId = body.format_id;
            const type = body.type || 'video';

            if (!formatId) {
                return addSecurityHeaders(NextResponse.json(
                    { success: false, error: 'format_id is required' },
                    { status: 400 }
                ));
            }

            const apiUrl = `https://api.gimita.id/api/downloader/ytdown?url=${encodeURIComponent(url)}&format_id=${formatId}&type=${type}`;

            console.log('Calling ytdown:', apiUrl);

            const apiResponse = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (!apiResponse.ok) {
                throw new Error(`API responded with status: ${apiResponse.status}`);
            }

            const data = await apiResponse.json();
            console.log('ytdown response:', data);

            if (!data.success) {
                throw new Error(data.message || 'Failed to get download link');
            }

            // Construct full download URL
            let downloadUrl = data.download_url;
            if (downloadUrl && downloadUrl.startsWith('/')) {
                downloadUrl = `https://api.gimita.id${downloadUrl}`;
            }

            return addSecurityHeaders(NextResponse.json({
                success: true,
                data: {
                    download_url: downloadUrl,
                    filename: data.filename,
                    filesize: data.filesize,
                    title: data.title,
                    type: data.type,
                    expires_in: data.expires_in,
                },
            }));
        }

        return addSecurityHeaders(NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
        ));
    } catch (error) {
        console.error('YouTube API Error:', error);
        return addSecurityHeaders(NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Service temporarily unavailable' },
            { status: 500 }
        ));
    }
}
