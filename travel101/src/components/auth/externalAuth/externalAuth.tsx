"use client";

import { } from "react";
import Image from "next/image";

const socialIcons = [
	{ src: "/icons/social_logo/google-icon.svg", alt: "Google", url: "http://localhost:8080/oauth2/authorization/google" },
	{ src: "/icons/social_logo/facebook-icon.svg", alt: "Facebook", url: "" },
];

export default function ExternalAuthButtons() {
	return (
		<div className="flex justify-center items-center gap-4 mt-8">
			{socialIcons.map(({ src, alt, url }) => (
				<button
					onClick={() => {
						if (url) window.location.href = url;
						else alert(`${alt} login not available yet`);
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
