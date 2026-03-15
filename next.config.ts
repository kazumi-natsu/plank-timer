import type { NextConfig } from "next";
// @ts-expect-error next-pwa has no type declarations
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  turbopack: {},
};

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPWAConfig(nextConfig);
