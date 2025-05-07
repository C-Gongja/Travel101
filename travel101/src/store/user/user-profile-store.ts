import { UserSnippetStore } from "@/types/user/userSnippetTypes";
import { create } from "zustand";

export const useSnippetStore = create<UserSnippetStore>((set) => ({
	userSnippet: null,
	setUserSnippet: (userSnippet) => set({ userSnippet }),
	updateUserSnippet: (key, value) => set((state) => ({
		userSnippet: state.userSnippet ? { ...state.userSnippet, [key]: value } : null
	})),
}));
