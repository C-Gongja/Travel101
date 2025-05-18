import { create } from 'zustand';

interface AuthModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	isSignUp: boolean;
	setIsSignUp: (isSignUp: boolean) => void;
	afterAuthCallback: (() => void) | null;
	setAfterAuthCallback: (cb: (() => void) | null) => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false, isSignUp: false }),
	isSignUp: false,
	setIsSignUp: (isSignUp: boolean) => set({ isSignUp: isSignUp }),
	afterAuthCallback: null,
	setAfterAuthCallback: (cb) => set({ afterAuthCallback: cb }),
}));
