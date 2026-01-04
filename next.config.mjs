/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.tiktokcdn.com',
            },
            {
                protocol: 'https',
                hostname: '**.tiktokcdn-us.com',
            },
            {
                protocol: 'https',
                hostname: '**.tiktokcdn-eu.com',
            },
            {
                protocol: 'https',
                hostname: 'tikcdn.io',
            },
            {
                protocol: 'https',
                hostname: 'p16-sign-sg.tiktokcdn.com',
            },
            {
                protocol: 'https',
                hostname: 'p16-sign-va.tiktokcdn.com',
            },
        ],
        unoptimized: false,
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
