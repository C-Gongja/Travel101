import { fetchVerifyUser } from "@/app/api/auth/authApi";
import { create } from "zustand";

interface User {
	uid: string;
	name: string;
	roles: string[];
}

interface UserStore {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	accessToken: string | null;
	setToken: (token: string) => void;
	setUser: (user: { uuid: string; name: string; roles: { authority: string }[] }) => void;
	clearUser: () => void;
	verifyUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	isLoading: false,
	isAuthenticated: false,
	accessToken: null,

	setToken: (accessToken) => {
		if (typeof window !== "undefined") {
			localStorage.setItem("accessToken", accessToken);
		}
		set({ accessToken });
	},
	setUser: (userData) => {
		set({ isLoading: true });
		set({
			user: {
				uid: userData.uuid,
				name: userData.name,
				roles: userData.roles.map((role) => role.authority),
			},
			isAuthenticated: true,
		});
		set({ isLoading: false });
	},
	clearUser: () => {
		if (typeof window !== "undefined") {
			localStorage.removeItem("accessToken");
		}
		set({
			user: null,
			isAuthenticated: false,
			accessToken: null,
		});
	},
	verifyUser: async () => {
		try {
			set({ isLoading: true });
			const response = await fetchVerifyUser();

			if (response && response.user) {
				set({
					user: {
						uid: response.user.uuid,
						name: response.user.name,
						roles: response.user.roles.map((role) => role.authority),
					},
					isAuthenticated: true,
					accessToken: response.accessToken,
				});

				if (typeof window !== "undefined") {
					localStorage.setItem("accessToken", response.accessToken);
				}
				set({ isLoading: false });
			} else {
				set({ isLoading: false });
				throw new Error("Invalid user data received");
			}
		} catch (error) {
			console.error("User verification failed:", error);
			set({
				user: null,
				isAuthenticated: false,
				accessToken: null,
			});
			set({ isLoading: false });
		}
	},
}));

