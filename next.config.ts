import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/+$/, "") || "";
const staticExport = process.env.STATIC_EXPORT !== "false";

const nextConfig: NextConfig = {
  ...(staticExport && { output: "export", basePath }),
  trailingSlash: true,
  reactStrictMode: true,
  cacheComponents: false,
  partialPrefetching: false,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
  agentRules: false,
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
