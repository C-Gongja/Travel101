// pages/oauth2/redirect.tsx (Next.js 15 예시)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user/user-store";
import { fetchVerifyUser } from "@/api/auth/authApi";

// but the truth is that I don't need to do this since I have userProvider which will do user verify if it has a refreshTOken.
export default function OAuth2RedirectPage() {
	const router = useRouter();
	const { setUser, setToken } = useUserStore();

	const verifyUser = async () => {
		console.log("redirect verify");
		try {
			const response = await fetchVerifyUser();

			if (response?.user) {
				setUser({
					uuid: response.user.uuid,
					name: response.user.name,
					picture: response.user.picture,
					roles: response.user.roles.map((role: any) => role.authority),
				});
				setToken(response.accessToken);
			} else {
				setUser(null);
			}
		} catch (error) {
			console.error("User verification failed:", error);
			setUser(null);
		} finally {
			router.push('/');
		}
	};

	useEffect(() => {
		verifyUser();
	}, []);

	return <div>로그인 중입니다...</div>;
}
