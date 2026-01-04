// Security constants
export const SECURITY = {
    MAX_URL_LENGTH: 2048,
    RATE_LIMIT_REQUESTS: 20, // Increased for development
    RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
    FETCH_TIMEOUT_MS: 8000,
    ALLOWED_TIKTOK_DOMAINS: [
        'tiktok.com',
        'www.tiktok.com',
        'vm.tiktok.com',
        'vt.tiktok.com',
        'm.tiktok.com',
    ],
    ALLOWED_CDN_DOMAINS: [
        'tiktokcdn.com',
        'tiktokcdn-us.com',
        'tiktokcdn-eu.com',
        'tikcdn.io',
        'p16-sign-sg.tiktokcdn.com',
        'p16-sign-va.tiktokcdn.com',
        'p16-sign-sg.tiktokcdn.com',
        // YouTube download services
        'savenow.to',
        'yt5s.io',
        'y2mate.com',
        'ssyoutube.com',
        'savefrom.net',
    ],
    ALLOWED_SCHEMES: ['http:', 'https:'],
    PRIVATE_IP_RANGES: [
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^192\.168\./,
        /^localhost$/i,
        /^0\.0\.0\.0$/,
    ],
};

export const API_CONFIG = {
    SSSTIK_DOMAIN: 'ssstik.io',
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};
