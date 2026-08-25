import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isProjectPages = process.env.GITHUB_ACTIONS === "true" && repository && !repository.endsWith(".github.io");
const basePath = isProjectPages ? `/${repository}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
};

export default nextConfig;
