'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
			<h1 className="text-4xl font-bold mb-4">404 - Page Not Found!</h1>
		</div>
	);
}
