// @ts-ignore
import withLess from "next-with-less";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default withLess({
  ...nextConfig,
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
});
