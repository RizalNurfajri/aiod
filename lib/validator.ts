// Re-export from security module for backward compatibility
export { isValidTikTokUrl, sanitizeUrl } from './security';

/**
 * Extracts a clean TikTok URL from user input
 * @deprecated Use sanitizeUrl from security module instead
 */
export function cleanTikTokUrl(url: string): string {
    return url.trim();
}
