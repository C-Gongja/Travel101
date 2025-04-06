import { create } from "zustand";

interface UserProfile {
	id: string;
	name: string;
	username: string;
	email: string;
	country?: string;
	state?: string;
	city?: string;
}

interface ProfileStore {
	profile: UserProfile | null;
	setProfile: (profile: UserProfile) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
	profile: null, // 초기 상태
	setProfile: (profile) => set({ profile }),
}));
