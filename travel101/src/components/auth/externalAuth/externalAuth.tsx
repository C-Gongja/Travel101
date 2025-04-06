"use client";

import { } from "react";
import Image from "next/image";

const socialIcons = [
	{ src: "/icons/social_logo/google-icon.svg", alt: "Google" },
	{ src: "/icons/social_logo/facebook-icon.svg", alt: "Facebook" },
	{ src: "/icons/social_logo/microsoft-icon.svg", alt: "Microsoft" },
	{ src: "/icons/social_logo/Apple_logo_black.svg", alt: "Apple" },
];

export default function ExternalAuthButtons() {
	return (
		<div className="flex justify-center items-center gap-4 mt-8">
			{socialIcons.map(({ src, alt }) => (
				<button
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
