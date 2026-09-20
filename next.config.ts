import type { NextConfig } from "next";

// In GitHub Codespaces the dev server is reached through a forwarded hostname such as
// <codespace-name>-3000.app.github.dev, which Next.js blocks in dev unless allowed.
const codespaceHost =
  process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
    ? `${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
    : null;

const nextConfig: NextConfig = {
  allowedDevOrigins: codespaceHost ? [codespaceHost] : [],
};

export default nextConfig;
