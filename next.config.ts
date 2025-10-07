import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Updated configuration for Turbopack
  turbopack: {
    rules: {
      "*.woff2": {
        loaders: ["file-loader"],
        as: "*.woff2",
      },
    },
  },
  // Ensure fonts are properly handled
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
