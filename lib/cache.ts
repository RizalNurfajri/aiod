/**
 * Simple in-memory cache for API responses
 * Helps avoid rate limiting by caching results
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class SimpleCache<T> {
    private cache: Map<string, CacheEntry<T>> = new Map();
    private ttl: number; // Time to live in milliseconds

    constructor(ttlMinutes: number = 10) {
        this.ttl = ttlMinutes * 60 * 1000;
    }

    set(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    get(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if expired
        if (Date.now() - entry.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    has(key: string): boolean {
        return this.get(key) !== null;
    }

    clear(): void {
        this.cache.clear();
    }

    // Clean up expired entries
    cleanup(): void {
        const now = Date.now();
        // Use Array.from to avoid iterator issues in some environments
        Array.from(this.cache.entries()).forEach(([key, entry]) => {
            if (now - entry.timestamp > this.ttl) {
                this.cache.delete(key);
            }
        });
    }
}

// Export singleton instance
export const apiCache = new SimpleCache(10); // 10 minutes TTL

// Auto cleanup every 5 minutes
if (typeof window === 'undefined') {
    setInterval(() => {
        apiCache.cleanup();
    }, 5 * 60 * 1000);
}
