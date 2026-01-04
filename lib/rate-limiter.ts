import { SECURITY } from './constants';

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store for rate limiting (serverless-compatible)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
        if (entry.resetAt < now) {
            rateLimitStore.delete(key);
        }
    });
}, 5 * 60 * 1000);

/**
 * IP-based rate limiter
 * Returns: { success: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(identifier: string): {
    success: boolean;
    remaining: number;
    resetAt: number;
} {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // No entry or expired - create new
    if (!entry || entry.resetAt < now) {
        const resetAt = now + SECURITY.RATE_LIMIT_WINDOW_MS;
        rateLimitStore.set(identifier, {
            count: 1,
            resetAt,
        });

        return {
            success: true,
            remaining: SECURITY.RATE_LIMIT_REQUESTS - 1,
            resetAt,
        };
    }

    // Check if limit exceeded
    if (entry.count >= SECURITY.RATE_LIMIT_REQUESTS) {
        return {
            success: false,
            remaining: 0,
            resetAt: entry.resetAt,
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        success: true,
        remaining: SECURITY.RATE_LIMIT_REQUESTS - entry.count,
        resetAt: entry.resetAt,
    };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
    // Check common proxy headers
    const forwarded = headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIP = headers.get('x-real-ip');
    if (realIP) {
        return realIP.trim();
    }

    // Fallback to a default (not ideal but works for development)
    return 'unknown';
}
