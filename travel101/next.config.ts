import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		// `domains` 속성 (Next.js 12 이하 또는 간단한 경우)
		// 와일드카드 사용이 불가하여 모든 서브도메인을 명시해야 할 수 있습니다.
		domains: [
			'lh3.googleusercontent.com',
			// 여기에 S3 버킷의 호스트 이름을 추가하세요.
			'sharavel-s3-bucket.s3.us-east-2.amazonaws.com',
			// 만약 다른 S3 리전을 사용하거나, CloudFront URL 등을 사용한다면 여기에 추가해야 합니다.
			// 예: 'your-other-bucket.s3.amazonaws.com',
			// 'd123abc456def.cloudfront.net', // CloudFront를 사용한다면
		],

		// `remotePatterns` 속성 (Next.js 13부터 권장, 더 유연함)
		// 와일드카드를 지원하여 서브도메인이나 경로 패턴을 더 쉽게 지정할 수 있습니다.
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
			// 여기에 S3 버킷의 호스트 이름을 추가하세요.
			{
				protocol: 'https',
				hostname: 'sharavel-s3-bucket.s3.us-east-2.amazonaws.com',
				port: '',
				pathname: '/trips/**', // `/trips/` 이후의 모든 경로 허용 (필요에 따라 더 구체적으로 지정 가능)
			},
			// 다른 S3 버킷이나 CloudFront 도메인이 있다면 아래와 같이 추가
			// {
			//   protocol: 'https',
			//   hostname: 'your-other-bucket.s3.amazonaws.com',
			//   pathname: '/**', // 모든 경로 허용
			// },
			// {
			//   protocol: 'https',
			//   hostname: 'd123abc456def.cloudfront.net',
			//   pathname: '/**',
			// },
		],
	},
};

export default nextConfig;