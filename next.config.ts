import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        GOOGLE_MAPS_API_KEY: 'AIzaSyAFFpnktsKFSbEjOPNvw8CggDzh25rWssM'
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "plus.unsplash.com",
            },

        ],
    },
};

export default nextConfig;
