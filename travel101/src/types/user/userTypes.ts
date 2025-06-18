export interface UserAuthResponse {
	user: User;
	accessToken: string;
}

export interface User {
	uuid: string;
	name: string;
	username: string;
	picture: string;
	roles: { authority: string; }[];
}

export interface UserStore {
	user: User | null;
	isUserLoading: boolean;
	isAuthenticated: boolean | null;
	accessToken: string | null;
	setToken: (token: string) => void;
	setUser: (userData: {
		picture: string; uuid: string; name: string; username: string; roles: { authority: string }[]
	} | null) => void;
	setIsUserLoading: (isUserLoading: boolean) => void;
	clearUser: () => void;
}