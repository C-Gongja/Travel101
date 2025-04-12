'use client'

import { useUserContext } from "@/components/providers/userProvider";
import { useUserStore } from "@/store/user/user-store";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated, isUserLoading } = useUserStore();
	const { isUserInitialized } = useUserContext(); // 초기화 상태 확인
	const router = useRouter();

	useEffect(() => {
		if (isUserInitialized && !isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, isUserLoading, router]);

	if (!isUserInitialized) {
		return <div>Loading...</div>;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
