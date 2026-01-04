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
};

export default nextConfig;
