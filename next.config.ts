import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 keeps the text on enlarged brochure pages crisp.
    qualities: [75, 90],
  },
};

export default nextConfig;
