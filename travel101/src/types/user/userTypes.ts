export interface User {
	uid: string;
	name: string;
	roles: string[];
}

export interface UserStore {
	user: User | null;
	isUserLoading: boolean;
	isAuthenticated: boolean | null;
	accessToken: string | null;
	setToken: (token: string) => void;
	setUser: (userData: { uuid: string; name: string; roles: { authority: string }[] } | null) => void;
	setIsUserLoading: (isUserLoading: boolean) => void;
	clearUser: () => void;
}