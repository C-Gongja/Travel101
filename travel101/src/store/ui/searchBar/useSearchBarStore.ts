import { create } from 'zustand';

interface UIState {
	isHeroVisible: boolean;
	setHeroVisible: (visible: boolean) => void;
}

export const useSearchBarStore = create<UIState>((set) => ({
	isHeroVisible: true,
	setHeroVisible: (visible) => set({ isHeroVisible: visible }),
}));
