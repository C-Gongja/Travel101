import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['lh3.googleusercontent.com'],
		// 또는 더 세밀한 제어를 위해 remotePatterns 사용
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
