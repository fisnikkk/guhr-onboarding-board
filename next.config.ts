import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. Without this, Next walks up the tree,
  // finds an unrelated lockfile in the home directory, and warns about an
  // ambiguous root. (No effect on Vercel, where the repo root is the project.)
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
