import { useEffect, useState, useRef } from 'react';

export function useIsInView(threshold = 0.1, offsetTop = 100) {
	const [isInView, setIsInView] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!ref.current) return;

		const observer = new IntersectionObserver(
			([entry]) => setIsInView(entry.isIntersecting),
			{
				threshold,
				rootMargin: `-${offsetTop}px 0px 0px 0px`, // 여기서 조정
			}
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [offsetTop]);

	return { ref, isInView };
}