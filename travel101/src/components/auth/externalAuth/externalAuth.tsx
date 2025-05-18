"use client";

import { } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const socialIcons = [
	{ src: "/icons/social_logo/google-icon.svg", alt: "Google", provider: "google" },
	{ src: "/icons/social_logo/facebook-icon.svg", alt: "Facebook", provider: "facebook" }, // 예시용
];

export default function ExternalAuthButtons() {
	const pathname = usePathname();

	const handleSocialLogin = (provider: string) => {
		if (!provider) {
			alert("Provider not supported");
			return;
		}

		const redirectUrl = `http://localhost:8080/oauth2/authorization/${provider}?redirect_uri=${encodeURIComponent(
			`${window.location.origin}${pathname}`
		)}`;

		window.location.href = redirectUrl;
	};

	return (
		<div className="flex justify-center items-center gap-4 mt-8">
			{socialIcons.map(({ src, alt, provider }) => (
				<button
					onClick={() => {
						if (provider === "google") {
							handleSocialLogin(provider);
						} else {
							alert(`${alt} login not available yet`);
						}
					}}
					key={alt}
					className="w-[50px] h-[50px] flex items-center justify-center bg-white rounded-full border-none cursor-pointer transition-transform duration-300 hover:scale-110 shadow-md"
				>
					<Image
						src={src}
						alt={alt}
						width={30}
						height={30}
						className=""
						priority
					/>
				</button>
			))}
		</div>
	);
}
