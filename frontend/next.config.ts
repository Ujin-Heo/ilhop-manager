import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 모든 호스트네임을 허용
      },
      {
        protocol: "http",
        hostname: "**", // http 프로토콜도 필요한 경우 추가
      },
    ],
  },
};

export default nextConfig;