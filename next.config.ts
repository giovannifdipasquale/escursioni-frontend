import type { NextConfig } from "next";
import config from "./next-i18next.config";

const nextConfig: NextConfig = {
  /* config options here */
  ...config,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.strapi.io",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
