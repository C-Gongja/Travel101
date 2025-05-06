import { UserPersonalInfoStore } from "@/types/user/userPersonalInfoTypes";
import { create } from "zustand";

export const PersonalInfoStore = create<UserPersonalInfoStore>((set) => ({
	personalInfo: null,
	setPersonalInfo: (personalInfo) => set({ personalInfo }),
	updateField: (key, value) => set((state) => ({
		personalInfo: state.personalInfo ? { ...state.personalInfo, [key]: value } : null
	})),
}));
