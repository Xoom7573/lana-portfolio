import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // A self-contained server for the Docker image (see Dockerfile).
  output: "standalone",
  images: {
    // Images come from the CMS, which serves uploads under /api/media/file/.
    localPatterns: [{ pathname: "/api/media/file/**" }],
    // 90 keeps the text on enlarged brochure pages crisp.
    qualities: [75, 90],
  },
  // Payload's packages import .js paths that point at .ts sources.
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
  turbopack: { root: dirname },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
