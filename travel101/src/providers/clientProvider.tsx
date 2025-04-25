'use client';

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function ClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 기본 캐시 유지 시간 5분
			},
		},
	}));

	return (
		<QueryClientProvider client= { queryClient } >
		{ children }
		</QueryClientProvider>
  );
}