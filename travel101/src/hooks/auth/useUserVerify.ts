
import { useUserStore } from '@/store/user/user-store'; // user-store 경로 확인


export const useVerifyUser = () => {
	const { setUser, setToken, setIsUserLoading, isAuthenticated } = useUserStore();

};