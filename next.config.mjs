import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  outputFileTracingRoot: __dirname,
  images: {
    // Explicitly allow ImageKit host via domains for compatibility
    domains: ["ik.imagekit.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  // Allow HMR/dev resources when accessed via the proxy host 127.0.0.1
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
