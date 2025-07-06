import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user/user-store';
import { useAuthModalStore } from '@/store/user/useAuthModalStore';

export const useAuthAction = () => {
	const { user } = useUserStore();
	const { onOpen, setAfterAuthCallback } = useAuthModalStore();
	const router = useRouter();

	const executeWithAuth = <T extends any[]>(
		action: (...args: T) => void | Promise<void>,
		redirectPath?: string
	) => {
		return (...args: T) => {
			if (!user) {
				setAfterAuthCallback(() => {
					router.push(redirectPath);
				});
				onOpen();
				return;
			}

			action(...args);
		};
	};

	return { executeWithAuth };
};