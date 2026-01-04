import { SECURITY, API_CONFIG } from './constants';

export interface VideoData {
    title: string;
    author: string;
    thumbnail: string;
    downloadUrl: string;
    audioUrl: string;
    stats?: {
        likes?: string;
        shares?: string;
        saves?: string;
        views?: string;
    };
}

/**
 * Fetch with timeout control
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
    } catch (error) {
        clearTimeout(timeout);
        throw error;
    }
}

/**
 * Sleep utility
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Try tikwm.com API
 */
async function tryTikwmApi(url: string, retries: number = 2): Promise<VideoData | null> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            if (attempt > 0) {
                await sleep(2000); // Wait 2 seconds before retry
            }

            const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;

            const response = await fetchWithTimeout(apiUrl, {
                headers: {
                    'User-Agent': API_CONFIG.USER_AGENT,
                    'Accept': 'application/json',
                },
            }, 8000);

            if (!response.ok) {
                continue;
            }

            const data = await response.json();

            if (data.code !== 0 || !data.data) {
                continue;
            }

            const videoData = data.data;

            if (!videoData.play && !videoData.hdplay) {
                continue;
            }
            return {
                title: videoData.title || 'TikTok Video',
                author: videoData.author?.unique_id || videoData.author?.nickname || 'Unknown',
                thumbnail: videoData.cover || videoData.origin_cover || '',
                downloadUrl: videoData.play || videoData.hdplay,
                audioUrl: videoData.music || videoData.music_info?.play_url || '',
                stats: {
                    likes: videoData.digg_count?.toString() || videoData.stats?.digg_count?.toString(),
                    shares: videoData.share_count?.toString() || videoData.stats?.share_count?.toString(),
                    saves: videoData.collect_count?.toString() || videoData.stats?.collect_count?.toString(),
                    views: videoData.play_count?.toString() || videoData.stats?.play_count?.toString(),
                },
            };
        } catch (error) {
            if (attempt === retries - 1) {
                return null;
            }
        }
    }

    return null;
}

/**
 * Try TikTok oEmbed API (basic metadata)
 */
async function tryTikTokOembed(url: string): Promise<VideoData | null> {
    try {
        const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;

        const response = await fetchWithTimeout(oembedUrl, {
            headers: {
                'User-Agent': API_CONFIG.USER_AGENT,
                'Accept': 'application/json',
            },
        }, 5000);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.title && data.author_name) {
            return {
                title: data.title,
                author: data.author_name,
                thumbnail: data.thumbnail_url || '',
                downloadUrl: url, // Return original URL
                audioUrl: '',
                stats: undefined,
            };
        }
    } catch (error) {
        // Silent fail
    }

    return null;
}

/**
 * Main download function with multiple fallbacks
 */
export async function downloadVideo(url: string): Promise<VideoData> {
    // Try tikwm.com first (with retries)
    const tikwmResult = await tryTikwmApi(url, 2);
    if (tikwmResult) {
        return tikwmResult;
    }

    // Fallback to TikTok oEmbed
    const oembedResult = await tryTikTokOembed(url);
    if (oembedResult) {
        return oembedResult;
    }

    // All methods failed
    throw new Error(
        'Unable to fetch video. Please try again in a few seconds. ' +
        'If the problem persists, the video may be private or unavailable.'
    );
}
