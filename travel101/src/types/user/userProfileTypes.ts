export interface UserProfile {
	id: string;
	name: string;
	username: string;
	picture: string;
	email: string;
	country?: string;
	state?: string;
	city?: string;
}

export interface ProfileStore {
	profile: UserProfile | null;
	setProfile: (profile: UserProfile) => void;
}