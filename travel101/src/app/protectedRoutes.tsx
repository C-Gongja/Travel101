'use client'

import { useUserContext } from "@/providers/userProvider";
import { useUserStore } from "@/store/user/user-store";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect } from "react";


//전페이지로 redirect. 하거나 그냥 login modal 만 띄우기. 절대 protected pages들을 보여주면 안된다.
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
