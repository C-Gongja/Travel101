import { fetchLogout, fetchVerifyUser } from "@/api/auth/authApi";
import { UserStore } from "@/types/user/userTypes";
import { create } from "zustand";

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	isUserLoading: false,
	isAuthenticated: null,
	accessToken: null,

	setToken: (accessToken) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("accessToken", accessToken);
		}
		set({ accessToken });
	},
	setUser: (userData) => {
		set({ isUserLoading: true });
		if (userData === null) {
			set({
				user: null,
				isAuthenticated: false,
			});
		} else {
			set({
				user: {
					uuid: userData.uuid,
					name: userData.name,
					username: userData.username,
					picture: userData.picture,
					roles: userData.roles,
				},
				isAuthenticated: true,
			});
		}
		set({ isUserLoading: false });
	},
	setIsUserLoading: (isUserLoading: boolean) => set({ isUserLoading }),
	clearUser: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("accessToken");
		}
		// 2. refreshToken 삭제 (서버에서 HttpOnly 쿠키 삭제 요청)
		fetchLogout();
		set({
			user: null,
			isAuthenticated: false,
			accessToken: null,
		});
		// need to refresh
	},
}));

