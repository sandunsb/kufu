import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
  register: true,
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
