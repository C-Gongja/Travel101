import { ProfileStore } from "@/types/user/userProfileTypes";
import { create } from "zustand";

export const useProfileStore = create<ProfileStore>((set) => ({
	profile: null, // 초기 상태
	setProfile: (profile) => set({ profile }),
}));
