import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingRoot: path.join(process.cwd()),
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
};

export default nextConfig;
