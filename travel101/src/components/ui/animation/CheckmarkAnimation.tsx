import { useEffect, useState } from "react";

export default function CheckmarkAnimation() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// 모의 완료 처리
		const timeout = setTimeout(() => {
			setIsVisible(true);
		}, 300); // 애니메이션 시작 지연

		return () => clearTimeout(timeout);
	}, []);

	return (
		<div className="flex items-center justify-center w-full h-full">
			<svg
				viewBox="0 0 52 52"
				className="w-16 h-16"
			>
				<path
					className={`stroke-green-500 fill-none stroke-[4] transition-all duration-500 ease-in-out
					${isVisible ? "animate-draw-check" : "invisible"}`}
					d="M14 27 l8 8 l16 -16"
				/>
			</svg>
		</div>
	);
}
