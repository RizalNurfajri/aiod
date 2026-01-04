import { SECURITY } from './constants';

/**
 * Sanitize and normalize URL input
 */
export function sanitizeUrl(url: string): string {
    return url.trim().replace(/\s+/g, '');
}

/**
 * Check if URL points to private IP or localhost
 */
export function isPrivateIP(url: string): boolean {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        // Check against private IP patterns
        return SECURITY.PRIVATE_IP_RANGES.some(pattern => pattern.test(hostname));
    } catch {
        return false;
    }
}

/**
 * Validate proxy URL - must be a trusted TikTok CDN
 */
export function isValidProxyUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
        return false;
    }

    try {
        const urlObj = new URL(url);

        // Check scheme
        if (!SECURITY.ALLOWED_SCHEMES.includes(urlObj.protocol)) {
            return false;
        }

        // SSRF Protection: Block private IPs
        if (isPrivateIP(url)) {
            return false;
        }

        const hostname = urlObj.hostname.toLowerCase();

        // Check if hostname matches allowed CDN domains
        return SECURITY.ALLOWED_CDN_DOMAINS.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );
    } catch {
        return false;
    }
}

/**
 * Enhanced TikTok URL validation with SSRF protection
 */
export function isValidTikTokUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
        return false;
    }

    // Check length
    if (url.length > SECURITY.MAX_URL_LENGTH) {
        return false;
    }

    try {
        const urlObj = new URL(url);

        // Check scheme
        if (!SECURITY.ALLOWED_SCHEMES.includes(urlObj.protocol)) {
            return false;
        }

        // SSRF Protection: Block private IPs
        if (isPrivateIP(url)) {
            return false;
        }

        const hostname = urlObj.hostname.toLowerCase();

        // Check if hostname matches allowed TikTok domains
        const isValidDomain = SECURITY.ALLOWED_TIKTOK_DOMAINS.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );

        if (!isValidDomain) {
            return false;
        }

        // For full URLs, check if it contains /video/ or is a short link
        if (hostname.includes('vm.tiktok.com') || hostname.includes('vt.tiktok.com')) {
            return true; // Short links are valid
        }

        // For regular TikTok URLs, check for /video/ path
        return urlObj.pathname.includes('/video/');
    } catch {
        return false;
    }
}

/**
 * Validate User-Agent header
 */
export function isValidUserAgent(userAgent: string | null): boolean {
    // In development, allow all user agents
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    if (!userAgent || userAgent.trim().length === 0) {
        return false;
    }

    // Block suspicious user agents
    const suspiciousPatterns = [
        /curl/i,
        /wget/i,
        /python-requests/i,
    ];

    return !suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Sanitize response data - return only required fields
 */
export function sanitizeResponse(data: any): object {
    return {
        title: String(data.title || '').substring(0, 500),
        author: String(data.author || '').substring(0, 100),
        thumbnail: String(data.thumbnail || '').substring(0, 500),
        downloadUrl: String(data.downloadUrl || '').substring(0, 500),
        audioUrl: String(data.audioUrl || '').substring(0, 500),
        stats: data.stats || undefined,
    };
}

/**
 * Validate request payload
 */
export function validateRequestPayload(body: any): { valid: boolean; error?: string } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Invalid request body' };
    }

    const { url } = body;

    if (!url) {
        return { valid: false, error: 'URL is required' };
    }

    if (typeof url !== 'string') {
        return { valid: false, error: 'URL must be a string' };
    }

    if (url.length > SECURITY.MAX_URL_LENGTH) {
        return { valid: false, error: `URL too long. Maximum ${SECURITY.MAX_URL_LENGTH} characters` };
    }

    return { valid: true };
}
